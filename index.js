var fs = require('fs');
var path = require('path');
var ini = require('node-ini');

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
		"--screen=1",
	]);

	var instance = {
		_options: {
			path_subtitles: options.path_subtitles ? options.path_subtitles : './',
			path_videos: options.path_videos ? options.path_videos : './',
		},
		_player:mpvPlayer,
		_playing:false,
		_kara:null,

		play: function(kara){
			this._kara = kara;
			if(kara) {
				if(kara.video)
				{
					var video = path.resolve(this._options.path_videos, kara.video);
					if(fs.existsSync(video)){
						console.log('playing : '+kara.video);
						this._player.loadFile(video);
						this._player.volume(70);
						this._player.play();

						// video may need some delay to play
						setTimeout(function(){
							this._playing = true;
							if(kara.subtitle)
							{
								var lyrics = path.resolve(this._options.path_subtitles, kara.subtitle);
								if(fs.existsSync(lyrics)){
									console.log('subtitle : '+kara.subtitle);
									this._player.addSubtitles(lyrics);//, flag, title, lang)
								}
								else
								{
									console.log('Can not found subtitle '+kara.subtitle)
								}
							}
							else
							{
								console.log('No subtitle');
							}
							this._player.loadFile(path.resolve(__dirname,'__blank__.png'),'append');
							// TODO : try to customize color, font-size and position of this message
							this._player.command("show-text",[kara.title+' '+kara.message,2000]);
						}.bind(this),500);
					}
					else {
						console.log('Can not found video '+kara.video)
					}
				}
				else
				{
					console.log('No video');
				}
			}
			else
			{
				this.stop();
			}
		},
		pause: function(){
			this._player.pause();
		},
		resume: function(){
			this._player.play();
		},
	}

	instance._player.on('statuschange',function(status){
		if(instance._playing && status && status.filename && status.filename.match(/__blank__/))
		{
			// immediate switch to Playing = False to avoid multiple trigger
			instance._playing = false;
			instance._player.pause();
			if(typeof options.onEnd === 'function')
			{
				options.onEnd(instance._kara);
			}
		}
	});
	return instance;
};