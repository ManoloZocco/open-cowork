#!/usr/bin/env node

/**
 * Linux GUI smoke test:
 * - validates essential GUI automation binaries for current session type
 * - does not perform destructive GUI actions
 */

const { spawnSync } = require('child_process');

function run(cmd, args, timeout = 5000) {
  const result = spawnSync(cmd, args, {
    encoding: 'utf8',
    timeout,
  });
  return {
    ok: result.status === 0,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function exists(binary) {
  return run('/usr/bin/which', [binary], 2000).ok;
}

function detectSessionType() {
  const session = (process.env.XDG_SESSION_TYPE || '').toLowerCase();
  if (session === 'wayland' || session === 'x11' || session === 'tty') return session;
  if (process.env.WAYLAND_DISPLAY) return 'wayland';
  if (process.env.DISPLAY) return 'x11';
  return 'unknown';
}

function main() {
  if (process.platform !== 'linux') {
    console.log('[linux-gui-smoke] Non-Linux platform, skipping.');
    return;
  }

  const sessionType = detectSessionType();
  const requiredCommon = ['import'];
  const required = sessionType === 'wayland'
    ? [...requiredCommon, 'grim', 'slurp']
    : [...requiredCommon, 'xdotool', 'xrandr'];
  const missing = required.filter((cmd) => !exists(cmd));

  if (missing.length > 0) {
    console.error(
      `[linux-gui-smoke] Missing required tools for ${sessionType}: ${missing.join(', ')}`
    );
    process.exitCode = 1;
    return;
  }

  console.log(`[linux-gui-smoke] OK (${sessionType})`);
}

main();

