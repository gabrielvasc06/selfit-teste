const { spawn } = require('node:child_process');

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';

const processes = [
  {
    name: 'backend',
    command: npmCommand,
    args: ['--prefix', 'backend', 'start'],
  },
  {
    name: 'frontend',
    command: npmCommand,
    args: ['run', 'dev:front', '--', '--host', '127.0.0.1'],
  },
];

const children = processes.map(({ name, command, args }) => {
  const child = spawn(
    isWindows ? 'cmd.exe' : command,
    isWindows ? ['/d', '/s', '/c', command, ...args] : args,
    {
      stdio: 'inherit',
      shell: false,
    },
  );

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] finalizou com codigo ${code}`);
    }
  });

  return child;
});

function stopAll() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll();
  process.exit(0);
});
