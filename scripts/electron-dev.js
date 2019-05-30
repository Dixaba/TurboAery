const { exec } = require('child_process');

const PORT = 1337;

let commandLine;

if (process.platform === 'win32') {
  commandLine = `concurrently "set BROWSER=none&& set PORT=${PORT}&& npm start" "wait-on http://localhost:${PORT} && set PORT=${PORT} && electron ."`;
} else {
  commandLine = `concurrently "BROWSER=none PORT=${PORT} npm start" "wait-on http://localhost:${PORT} && PORT=${PORT} electron ."`;
}

const command = exec(commandLine);

command.stdout.on('data', process.stdout.write);
command.stderr.on('data', process.stderr.write);
command.on('error', process.stderr.write);
