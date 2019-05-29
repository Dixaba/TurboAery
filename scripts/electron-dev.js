const { exec } = require('child_process');

const { PORT = 3000 } = process.env;

let commandLine;

if (process.platform === 'win32') {
  commandLine = `concurrently "set BROWSER=none PORT=${PORT}&& npm start" "wait-on http://localhost:${PORT} && electron ."`;
} else {
  commandLine = `concurrently "BROWSER=none PORT=${PORT} npm start" "wait-on http://localhost:${PORT} && electron ."`;
}

const command = exec(commandLine);

command.stdout.on('data', process.stdout.write);
command.stderr.on('data', process.stderr.write);
command.on('error', process.stderr.write);
