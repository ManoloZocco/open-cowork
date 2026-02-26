/**
 * LinuxContainerBridge - Rootless container sandbox for Linux.
 *
 * This bridge executes commands in an isolated rootless Podman/Docker container
 * with the workspace mounted at /workspace.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
import { log, logError } from '../utils/logger';
import type {
  SandboxConfig,
  SandboxExecutor,
  ExecutionResult,
  DirectoryEntry,
  LinuxContainerStatus,
} from './types';

const execFileAsync = promisify(execFile);
const DEFAULT_CONTAINER_IMAGE =
  process.env.OPEN_COWORK_LINUX_SANDBOX_IMAGE || 'docker.io/library/node:20-bookworm-slim';

type ContainerRuntime = 'podman' | 'docker';

function normalizeSessionType(raw: string | undefined): LinuxContainerStatus['sessionType'] {
  const normalized = (raw || '').trim().toLowerCase();
  if (normalized === 'x11') return 'x11';
  if (normalized === 'wayland') return 'wayland';
  if (normalized === 'tty') return 'tty';
  return 'unknown';
}

function isRootlessDockerSecurityOption(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return false;
    return parsed.some((entry) => String(entry).includes('name=rootless'));
  } catch {
    return false;
  }
}

async function commandExists(command: string): Promise<boolean> {
  try {
    await execFileAsync('/usr/bin/which', [command], { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

async function getBinaryVersion(binary: string): Promise<string | undefined> {
  try {
    const { stdout, stderr } = await execFileAsync(binary, ['--version'], { timeout: 5000 });
    return (stdout || stderr || '').trim().split('\n')[0] || undefined;
  } catch {
    return undefined;
  }
}

async function detectRuntime(): Promise<{ runtime: ContainerRuntime; version?: string } | null> {
  if (await commandExists('podman')) {
    return { runtime: 'podman', version: await getBinaryVersion('podman') };
  }
  if (await commandExists('docker')) {
    return { runtime: 'docker', version: await getBinaryVersion('docker') };
  }
  return null;
}

async function detectRootless(runtime: ContainerRuntime): Promise<boolean> {
  try {
    if (runtime === 'podman') {
      const { stdout } = await execFileAsync('podman', ['info', '--format', 'json'], { timeout: 8000 });
      const info = JSON.parse(stdout) as any;
      const rootless =
        info?.host?.security?.rootless ??
        info?.Host?.Security?.Rootless ??
        info?.rootless;
      return Boolean(rootless);
    }

    const { stdout } = await execFileAsync(
      'docker',
      ['info', '--format', '{{json .SecurityOptions}}'],
      { timeout: 8000 }
    );
    if (isRootlessDockerSecurityOption(stdout.trim())) {
      return true;
    }

    // Best-effort fallback: Docker rootless CLI typically has this env var.
    return Boolean(process.env.DOCKER_HOST && process.env.DOCKER_HOST.includes('docker.sock'));
  } catch {
    return false;
  }
}

async function checkImageAvailable(runtime: ContainerRuntime, image: string): Promise<boolean> {
  try {
    if (runtime === 'podman') {
      await execFileAsync('podman', ['image', 'exists', image], { timeout: 5000 });
      return true;
    }

    await execFileAsync('docker', ['image', 'inspect', image], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

async function checkMissingGuiTools(sessionType: LinuxContainerStatus['sessionType']): Promise<string[]> {
  const requiredCommon = ['import'];
  const requiredX11 = ['xdotool', 'xrandr'];
  const requiredWayland = ['grim', 'slurp'];
  const required = new Set<string>(requiredCommon);

  if (sessionType === 'wayland') {
    requiredWayland.forEach((tool) => required.add(tool));
  } else {
    requiredX11.forEach((tool) => required.add(tool));
  }

  const checks = await Promise.all(
    Array.from(required).map(async (tool) => ({ tool, ok: await commandExists(tool) }))
  );
  return checks.filter((entry) => !entry.ok).map((entry) => entry.tool);
}

export class LinuxContainerBridge implements SandboxExecutor {
  private config: SandboxConfig | null = null;
  private workspacePath = '';
  private initialized = false;
  private runtime: ContainerRuntime | null = null;
  private image: string = DEFAULT_CONTAINER_IMAGE;
  private readonly containerWorkspacePath = '/workspace';

  static async checkLinuxContainerStatus(): Promise<LinuxContainerStatus> {
    if (process.platform !== 'linux') {
      return { available: false };
    }

    const runtimeInfo = await detectRuntime();
    const sessionType = normalizeSessionType(process.env.XDG_SESSION_TYPE);
    const desktop =
      process.env.XDG_CURRENT_DESKTOP ||
      process.env.DESKTOP_SESSION ||
      (process.env.KDE_FULL_SESSION ? 'KDE' : undefined);

    if (!runtimeInfo) {
      return {
        available: false,
        sessionType,
        desktop,
        missingGuiTools: await checkMissingGuiTools(sessionType),
      };
    }

    const rootless = await detectRootless(runtimeInfo.runtime);
    const image = DEFAULT_CONTAINER_IMAGE;
    const imageAvailable = await checkImageAvailable(runtimeInfo.runtime, image);

    return {
      available: rootless,
      runtime: runtimeInfo.runtime,
      rootless,
      version: runtimeInfo.version,
      image,
      imageAvailable,
      sessionType,
      desktop,
      missingGuiTools: await checkMissingGuiTools(sessionType),
    };
  }

  static async ensureImage(runtime: ContainerRuntime, image: string): Promise<boolean> {
    try {
      if (await checkImageAvailable(runtime, image)) {
        return true;
      }

      await execFileAsync(runtime, ['pull', image], {
        timeout: 5 * 60 * 1000,
        maxBuffer: 10 * 1024 * 1024,
      });
      return true;
    } catch (error) {
      logError('[LinuxContainerBridge] Failed to pull sandbox image:', error);
      return false;
    }
  }

  async initialize(config: SandboxConfig): Promise<void> {
    if (process.platform !== 'linux') {
      throw new Error('LinuxContainerBridge is only available on Linux');
    }

    this.config = config;
    this.workspacePath = path.resolve(config.workspacePath);

    if (!fs.existsSync(this.workspacePath)) {
      throw new Error(`Workspace does not exist: ${this.workspacePath}`);
    }

    const status = await LinuxContainerBridge.checkLinuxContainerStatus();
    if (!status.runtime) {
      throw new Error(
        'No supported container runtime detected. Install Podman rootless or Docker rootless.'
      );
    }

    if (!status.rootless) {
      throw new Error(
        `${status.runtime} is available but not running rootless. Configure rootless mode first.`
      );
    }

    this.runtime = status.runtime;
    this.image = status.image || DEFAULT_CONTAINER_IMAGE;

    const imageReady = await LinuxContainerBridge.ensureImage(this.runtime, this.image);
    if (!imageReady) {
      throw new Error(`Failed to prepare sandbox image: ${this.image}`);
    }

    this.initialized = true;
    log(
      `[LinuxContainerBridge] Initialized with ${this.runtime} (${status.version || 'unknown version'}) image=${this.image}`
    );
  }

  private validatePath(targetPath: string): string {
    if (!this.workspacePath) {
      throw new Error('Bridge not initialized');
    }

    const resolved = path.resolve(targetPath);
    const normalizedWorkspace = path.normalize(this.workspacePath);
    const normalizedTarget = path.normalize(resolved);

    if (!normalizedTarget.startsWith(normalizedWorkspace)) {
      throw new Error(`Path is outside workspace: ${resolved}`);
    }

    if (fs.existsSync(resolved)) {
      const realPath = fs.realpathSync(resolved);
      if (!realPath.startsWith(normalizedWorkspace)) {
        throw new Error(`Symlink escape detected: ${resolved} -> ${realPath}`);
      }
    }

    return resolved;
  }

  private toContainerPath(hostPath: string): string {
    const rel = path.relative(this.workspacePath, hostPath);
    if (!rel || rel === '.') return this.containerWorkspacePath;
    return path.posix.join(this.containerWorkspacePath, rel.split(path.sep).join('/'));
  }

  private buildRuntimeArgs(
    command: string,
    cwd: string,
    env?: Record<string, string>
  ): string[] {
    if (!this.runtime) {
      throw new Error('Container runtime not initialized');
    }

    const args: string[] = [
      'run',
      '--rm',
      '--network',
      'none',
      '--cap-drop',
      'ALL',
      '--security-opt',
      'no-new-privileges',
      '--pids-limit',
      '512',
      '--workdir',
      cwd,
      '--volume',
      `${this.workspacePath}:${this.containerWorkspacePath}:rw`,
    ];

    if (this.runtime === 'podman') {
      args.push('--userns', 'keep-id');
    } else if (typeof process.getuid === 'function' && typeof process.getgid === 'function') {
      args.push('--user', `${process.getuid()}:${process.getgid()}`);
    }

    const mergedEnv = {
      ...(this.config?.env || {}),
      ...(env || {}),
      WORKSPACE: this.containerWorkspacePath,
    };

    for (const [key, value] of Object.entries(mergedEnv)) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
      args.push('--env', `${key}=${value}`);
    }

    args.push(this.image, '/bin/bash', '-lc', command);
    return args;
  }

  async executeCommand(
    command: string,
    cwd?: string,
    env?: Record<string, string>
  ): Promise<ExecutionResult> {
    if (!this.initialized || !this.runtime) {
      throw new Error('Linux container bridge not initialized');
    }

    const hostCwd = cwd ? this.validatePath(cwd) : this.workspacePath;
    const containerCwd = this.toContainerPath(hostCwd);
    const runtimeArgs = this.buildRuntimeArgs(command, containerCwd, env);
    const timeoutMs = this.config?.timeout || 60000;

    return await new Promise<ExecutionResult>((resolve) => {
      const child = spawn(this.runtime as string, runtimeArgs, {
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;
        try {
          child.kill('SIGKILL');
        } catch {
          // ignore
        }
      }, timeoutMs);

      child.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      child.on('error', (error: Error) => {
        clearTimeout(timer);
        resolve({
          success: false,
          stdout,
          stderr: `${stderr}\n${error.message}`.trim(),
          exitCode: 1,
        });
      });

      child.on('close', (code: number | null) => {
        clearTimeout(timer);
        if (timedOut) {
          resolve({
            success: false,
            stdout,
            stderr: `${stderr}\nCommand timed out after ${timeoutMs}ms`.trim(),
            exitCode: 124,
          });
          return;
        }

        resolve({
          success: code === 0,
          stdout,
          stderr,
          exitCode: code ?? 1,
        });
      });
    });
  }

  async readFile(filePath: string): Promise<string> {
    const validPath = this.validatePath(filePath);
    return fs.readFileSync(validPath, 'utf-8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const validPath = this.validatePath(filePath);
    fs.mkdirSync(path.dirname(validPath), { recursive: true });
    fs.writeFileSync(validPath, content, 'utf-8');
  }

  async listDirectory(dirPath: string): Promise<DirectoryEntry[]> {
    const validPath = this.validatePath(dirPath);
    const entries = fs.readdirSync(validPath, { withFileTypes: true });
    return entries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      size: entry.isFile() ? fs.statSync(path.join(validPath, entry.name)).size : undefined,
    }));
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const validPath = this.validatePath(filePath);
      return fs.existsSync(validPath);
    } catch {
      return false;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const validPath = this.validatePath(filePath);
    if (fs.existsSync(validPath)) {
      fs.unlinkSync(validPath);
    }
  }

  async createDirectory(dirPath: string): Promise<void> {
    const validPath = this.validatePath(dirPath);
    fs.mkdirSync(validPath, { recursive: true });
  }

  async copyFile(src: string, dest: string): Promise<void> {
    const validSrc = this.validatePath(src);
    const validDest = this.validatePath(dest);
    fs.mkdirSync(path.dirname(validDest), { recursive: true });
    fs.copyFileSync(validSrc, validDest);
  }

  async shutdown(): Promise<void> {
    this.initialized = false;
    this.config = null;
    this.runtime = null;
    log('[LinuxContainerBridge] Shutdown complete');
  }
}

