import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Ensure strictly 1 APK exists in the project (clean up duplicate/legacy APKs)
const publicApkOld = path.join(rootDir, 'admin_dashboard/public/downloads/eworkforce.apk');
const distApkOld = path.join(rootDir, 'admin_dashboard/dist/downloads/eworkforce.apk');
const distMobileApk = path.join(rootDir, 'admin_dashboard/dist/downloads/eworkforce-mobile.apk');
[publicApkOld, distApkOld, distMobileApk].forEach((p) => {
  try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch (_) {}
});

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

const [nodeMajor, nodeMinor] = (process.versions.node || '0.0.0').split('.').map(Number);
if (nodeMajor < 22 || (nodeMajor === 22 && nodeMinor < 5)) {
  console.log('\x1b[33m%s\x1b[0m', '⚠️  NOTICE: Detected Node.js v' + process.versions.node);
  console.log('\x1b[33m%s\x1b[0m', '   The backend uses native SQLite (node:sqlite) which requires Node.js v22.5.0 or newer.');
  console.log('\x1b[33m%s\x1b[0m', '   If the backend fails to start, please install Node.js v22+ from https://nodejs.org/\n');
}

console.log('====================================================');
console.log('🚀 Starting Ework Workspace in VS Code...');
console.log('   - Backend API & SQLite:  http://localhost:5000');
console.log('   - Admin Web Dashboard:   http://localhost:5173');
console.log('====================================================\n');

function runService(name, cwd, command, args, colorCode) {
  const reset = '\x1b[0m';
  const color = `\x1b[${colorCode}m`;
  const prefix = `${color}[${name}]${reset} `;

  const cmdString = `${command} ${args.join(' ')}`;
  const proc = spawn(cmdString, [], {
    cwd,
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' },
    stdio: ['inherit', 'pipe', 'pipe']
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) console.log(prefix + line);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) console.error(prefix + line);
    });
  });

  proc.on('close', (code) => {
    console.log(`${prefix}Process exited with code ${code}`);
  });

  return proc;
}

const backendProc = runService(
  'Backend',
  path.join(rootDir, 'backend'),
  'node',
  ['--experimental-sqlite', 'src/server.js'],
  '36' // Cyan
);

const dashboardProc = runService(
  'Dashboard',
  path.join(rootDir, 'admin_dashboard'),
  npmCmd,
  ['run', 'dev'],
  '32' // Green
);

function shutdown() {
  console.log('\n🛑 Shutting down Ework services...');
  try {
    if (backendProc && !backendProc.killed) backendProc.kill('SIGINT');
    if (dashboardProc && !dashboardProc.killed) dashboardProc.kill('SIGINT');
  } catch (_) {}
  setTimeout(() => process.exit(0), 500);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
