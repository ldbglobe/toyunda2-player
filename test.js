var path = require('path');

// Simulation d'un gestionnaire de playlist bouclant sur 2 morceaux

var playlist = [
	{
		video:'Dragon Ball - OP - Maka fushigi Adventure.avi',
		subtitle:'Dragon Ball - OP - Maka fushigi Adventure.ass',
		title:'Dragon Ball - OP - Maka fushigi Adventure',
		message:'Requested by @lordb',
		kara_id:1,
	},
	{
		video:'Dragon Ball Z - OP1 - Cha-la Head Cha-la.avi',
		subtitle:'Dragon Ball Z - OP1 - Cha-la Head Cha-la.ass',
		title:'Dragon Ball Z - OP1 - Cha-la Head Cha-la',
		message:'Requested by @lordb',
		kara_id:2,
	},
];
var idx = 0;

function play()
{
	kara = playlist[idx%2];
	console.log("Starting of \""+kara.title+"\"");
	player.play(kara);
	idx++;
}

// get real binary systeme path
// used to build real path to ressources (mpv, video, sub, ...)
var basepath = require('./_get_basepath.js')('bin/mpv.exe'); // test by fileExists on "mpv.exe"


var player = require('./index.js')({
	path_mpv:path.join(basepath,'./bin'), // path to the folder containing mpv player binaries
	path_videos:path.join(basepath,'samples/videos'),
	path_subtitles:path.join(basepath,'samples/lyrics'),
	onEnd:function(kara){
		console.log("End of current song \""+kara.title+"\"");
		play();
	}
});

if(player) {
	play();
}
