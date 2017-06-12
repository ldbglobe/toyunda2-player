var path = require('path');
var ini = require('node-ini');

var readkara = function(path)
{
	var cfg = ini.parseSync(path);
	for(var i in cfg)
		cfg[i]  = cfg[i].replace(/^"/,'').replace(/"$/,'');
	return cfg;
}

module.exports = function(options){

	var mpvAPI = require('node-mpv');
	var mpvPlayer = new mpvAPI({
		"audio_only": false,
		binary: path.resolve(__dirname, './mpv.exe'),
		socket: '\\\\.\\pipe\\mpvsocket',
		"time_update": 1,
		verbose: false,
		debug: false,
	},
	[
		//"--fullscreen",
		"--fps=60",
	]);

	return {
		_options: {
			path_karas:  options.path_karas  ? options.path_karas  : './',
			path_lyrics: options.path_lyrics ? options.path_lyrics : './',
			path_videos: options.path_videos ? options.path_videos : './',
		},
		_player:mpvPlayer,
		_playlist:[],
		_current:false,

		play: function(){
			if(!this._current) {
				this.next();
			}
			else {
				var kara = readkara(path.resolve(this._options.path_karas, this._current.file));
				if(kara.videofile)
				{
					var video = path.resolve(this._options.path_videos, kara.videofile);
					console.log('playing : '+kara.videofile);
					this._player.loadFile(video);
					this._player.volume(70);
					this._player.play();
					if(kara.subfile) {
						var lyrics = path.resolve(this._options.path_lyrics, kara.subfile);
						console.log('subtitle : '+kara.subfile);
						this._player.addSubtitles(lyrics);//, flag, title, lang)
					}
				}
				else {
					console.log('Can not found videofile reference in '+this._current.file)
				}
			}
		},
		pause: function(){

		},
		next: function(){
			if(this._playlist.length) {
				this._current = this._playlist.shift();
				this.play();
			}
			else {
				console.log('Empty playlist');
			}
		},
		addKara:function(kara_file,kara_id){
			// add kara at the end of playlist
			this._playlist.push({file:kara_file,id:kara_id});
		},
		removeKara:function(kara_id){
			// remove all "kara_id" reference from the playlist
			// kara added without id can not be remove by this method
		},
		setPlaylist:function(karaArray){
			// replace current playlit by this one
			this._playlist = karaArray;
		},
		clearPlaylist:function(){
			// purge current playlist
			this._playlist = [];
		}
	}
};

/*
			*/