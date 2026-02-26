#!/usr/bin/env node

/**
 * Linux sandbox smoke test:
 * - verifies preflight/runtime availability
 * - executes a trivial command inside the rootless container runtime
 */

const { spawnSync } = require('child_process');

function run(cmd, args, timeout = 20000) {
  const result = spawnSync(cmd, args, {
    encoding: 'utf8',
    timeout,
    maxBuffer: 10 * 1024 * 1024,
  });
  return {
    ok: result.status === 0,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
    status: result.status,
  };
}

function detectRuntime() {
  if (run('/usr/bin/which', ['podman'], 2000).ok) return 'podman';
  if (run('/usr/bin/which', ['docker'], 2000).ok) return 'docker';
  return null;
}

function main() {
  if (process.platform !== 'linux') {
    console.log('[linux-sandbox-smoke] Non-Linux platform, skipping.');
    return;
  }

  const preflight = run('node', ['scripts/linux-preflight.js', '--strict', '--json'], 20000);
  if (!preflight.ok) {
    console.error('[linux-sandbox-smoke] Preflight failed:');
    console.error(preflight.stdout || preflight.stderr);
    process.exitCode = 1;
    return;
  }

  const runtime = detectRuntime();
  if (!runtime) {
    console.error('[linux-sandbox-smoke] No runtime found (podman/docker).');
    process.exitCode = 1;
    return;
  }

  const image = process.env.OPEN_COWORK_LINUX_SANDBOX_IMAGE || 'docker.io/library/node:20-bookworm-slim';
  const args = ['run', '--rm', '--network', 'none', image, '/bin/bash', '-lc', 'echo sandbox-ok'];
  const smoke = run(runtime, args, 45000);

  if (!smoke.ok || !smoke.stdout.includes('sandbox-ok')) {
    console.error('[linux-sandbox-smoke] Container command failed.');
    console.error(smoke.stderr || smoke.stdout);
    process.exitCode = 1;
    return;
  }

  console.log('[linux-sandbox-smoke] OK');
}

main();

