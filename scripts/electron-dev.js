const { exec } = require('child_process');

let commandLine;

if (process.platform === 'win32') {
  commandLine = 'concurrently "set BROWSER=none&& npm start" "wait-on http://localhost:3000 && electron ."';
} else {
  commandLine = 'concurrently "BROWSER=none npm start" "wait-on http://localhost:3000 && electron ."';
}

const command = exec(commandLine);

command.stdout.on('data', process.stdout.write);
command.stderr.on('data', process.stderr.write);
command.on('error', process.stderr.write);
