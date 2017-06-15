var path = require('path');
var probe = require('node-ffprobe');

probe.FFPROBE_PATH = path.join(__dirname,'bin/ffprobe.exe');
probe('samples/videos/Dragon Ball - Op - Maka Fushigi Adventure.avi',function (err, videodata) {
        if (err) {
            console.log("Impossible de probe la vidéo :"+err);
        } else {
            videolength = videodata.format.duration;
            var m = Math.floor(videolength/60);
            var s = Math.floor(videolength - m*60);
	    	console.log('Durée de la vidéo = '+m+'m'+s+'s');
        }
});