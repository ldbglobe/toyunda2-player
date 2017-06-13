var fs = require('fs');
fs.writeFileSync('./build/mpv.exe', fs.readFileSync('mpv.exe'));
var ncp = require('ncp');
ncp('./samples', './build/samples');