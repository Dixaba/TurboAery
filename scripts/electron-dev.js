var exec = require('child_process').exec;

var command_line = 'electron ./app/';

if(process.platform === 'win32') {  
  command_line = 'concurrently "set BROWSER=none&& npm start" "wait-on http://localhost:3000 && electron ."';
} else {
  command_line = 'concurrently "BROWSER=none npm start" "wait-on http://localhost:3000 && electron ."';
}

var command = exec(command_line);

command.stdout.on('data', function(data) {
  process.stdout.write(data);
});
command.stderr.on('data', function(data) {
  process.stderr.write(data);
});
command.on('error', function(err) {
  process.stderr.write(err);
});