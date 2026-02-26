#!/usr/bin/env node

/**
 * Linux preflight diagnostics for Open Cowork on Ubuntu/KDE-like environments.
 *
 * Checks:
 * - Container runtime availability (Podman/Docker) + rootless mode
 * - Desktop session (X11/Wayland)
 * - GUI helper tools availability for current session type
 *
 * Usage:
 *   node scripts/linux-preflight.js
 *   node scripts/linux-preflight.js --strict
 *   node scripts/linux-preflight.js --json
 */

const { spawnSync } = require('child_process');
const os = require('os');

const STRICT = process.argv.includes('--strict');
const JSON_ONLY = process.argv.includes('--json');

function run(cmd, args, timeout = 6000) {
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

function commandExists(command) {
  return run('/usr/bin/which', [command], 2000).ok;
}

function detectSessionType() {
  const envSession = (process.env.XDG_SESSION_TYPE || '').trim().toLowerCase();
  if (envSession === 'x11' || envSession === 'wayland' || envSession === 'tty') {
    return envSession;
  }
  if (process.env.WAYLAND_DISPLAY) return 'wayland';
  if (process.env.DISPLAY) return 'x11';
  return 'unknown';
}

function detectDesktop() {
  return (
    process.env.XDG_CURRENT_DESKTOP ||
    process.env.DESKTOP_SESSION ||
    (process.env.KDE_FULL_SESSION ? 'KDE' : undefined) ||
    'unknown'
  );
}

function detectRuntime() {
  if (commandExists('podman')) {
    return {
      runtime: 'podman',
      version: run('podman', ['--version']).stdout || undefined,
      rootless: detectPodmanRootless(),
    };
  }
  if (commandExists('docker')) {
    return {
      runtime: 'docker',
      version: run('docker', ['--version']).stdout || undefined,
      rootless: detectDockerRootless(),
    };
  }
  return null;
}

function detectPodmanRootless() {
  const info = run('podman', ['info', '--format', 'json'], 8000);
  if (!info.ok) return false;
  try {
    const parsed = JSON.parse(info.stdout);
    return Boolean(
      parsed?.host?.security?.rootless ??
        parsed?.Host?.Security?.Rootless ??
        parsed?.rootless
    );
  } catch {
    return false;
  }
}

function detectDockerRootless() {
  const info = run('docker', ['info', '--format', '{{json .SecurityOptions}}'], 8000);
  if (!info.ok) return false;
  try {
    const options = JSON.parse(info.stdout);
    return Array.isArray(options) && options.some((entry) => String(entry).includes('name=rootless'));
  } catch {
    return false;
  }
}

function collectGuiTools(sessionType) {
  const common = ['import'];
  const x11 = ['xdotool', 'xrandr'];
  const wayland = ['grim', 'slurp'];
  const required = sessionType === 'wayland' ? [...common, ...wayland] : [...common, ...x11];
  const optional = sessionType === 'wayland'
    ? ['ydotool', 'wtype', 'wl-copy', 'wl-paste', 'spectacle']
    : ['xwininfo', 'scrot', 'gnome-screenshot', 'spectacle'];

  const requiredMissing = required.filter((tool) => !commandExists(tool));
  const optionalMissing = optional.filter((tool) => !commandExists(tool));
  return { required, optional, requiredMissing, optionalMissing };
}

function main() {
  const platform = process.platform;
  const sessionType = detectSessionType();
  const desktop = detectDesktop();
  const runtime = detectRuntime();
  const guiTools = collectGuiTools(sessionType);

  const report = {
    platform,
    distro: {
      release: os.release(),
      node: process.version,
      arch: process.arch,
    },
    sessionType,
    desktop,
    runtime: runtime || {
      runtime: null,
      version: null,
      rootless: false,
    },
    guiTools,
    recommendations: [],
    ok: true,
  };

  if (platform !== 'linux') {
    report.ok = false;
    report.recommendations.push('This preflight is intended for Linux hosts.');
  }

  if (!runtime) {
    report.ok = false;
    report.recommendations.push(
      'Install Podman rootless (recommended) or Docker rootless for Linux sandbox isolation.'
    );
  } else if (!runtime.rootless) {
    report.ok = false;
    report.recommendations.push(
      `${runtime.runtime} is installed but not rootless. Configure rootless mode for secure sandboxing.`
    );
  }

  if (guiTools.requiredMissing.length > 0) {
    report.ok = false;
    report.recommendations.push(
      `Install required GUI tools for ${sessionType}: ${guiTools.requiredMissing.join(', ')}`
    );
  }

  if (!JSON_ONLY) {
    console.log('[linux-preflight] Open Cowork Linux diagnostics');
    console.log(`- Platform: ${platform} (${process.arch})`);
    console.log(`- Session: ${sessionType}`);
    console.log(`- Desktop: ${desktop}`);
    if (runtime) {
      console.log(`- Runtime: ${runtime.runtime} (${runtime.version || 'unknown version'})`);
      console.log(`- Rootless: ${runtime.rootless ? 'yes' : 'no'}`);
    } else {
      console.log('- Runtime: not found');
    }
    console.log(
      `- Required GUI tools missing: ${
        guiTools.requiredMissing.length > 0 ? guiTools.requiredMissing.join(', ') : 'none'
      }`
    );
    if (guiTools.optionalMissing.length > 0) {
      console.log(`- Optional GUI tools missing: ${guiTools.optionalMissing.join(', ')}`);
    }
    if (report.recommendations.length > 0) {
      console.log('- Recommendations:');
      for (const recommendation of report.recommendations) {
        console.log(`  - ${recommendation}`);
      }
    }
    console.log('');
  }

  console.log(JSON.stringify(report, null, 2));

  if (STRICT && !report.ok) {
    process.exitCode = 1;
  }
}

main();

