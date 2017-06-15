var fs = require('fs');
var path = require('path');

module.exports = function(options){

	if(!fs.existsSync(options.path_mpv)){
		console.log('Unable to found mpv.exe');
		console.log('Received path was : '+options.path_mpv);
		return false;
	}

	var mpvAPI = require('node-mpv');
	var mpvPlayer = new mpvAPI({
		audio_only: false,
		binary: path.join(options.path_mpv,'mpv.exe'),
		socket: '\\\\.\\pipe\\mpvsocket',
		time_update: 1,
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
		_message_timeout:null,

		play: function(kara){
			this._kara = kara;
			if(kara) {
				if(kara.video)
				{
					var video = path.join(this._options.path_videos, kara.video);
					if(fs.existsSync(video)){
						console.log('playing : '+kara.video);
						this._player.loadFile(video);
						this._player.volume(70);
						// TODO : try to customize color, font-size and position of this message
						clearTimeout(this._message_timeout);
						this._player.setProperty('osc','yes');
						this._player.freeCommand('show-text "${osd-ass-cc/0}{\\\\alpha&H50&\\\\an7}'+kara.title+'${osd-ass-cc/1}" 3000');
						this._message_timeout = setTimeout(function(){
							this._player.freeCommand('show-text "${osd-ass-cc/0}{\\\\alpha&H50&\\\\an3}'+kara.message+'${osd-ass-cc/1}" 3000');
						}.bind(this),3000);

						this._player.play();

						// video may need some delay to play
						setTimeout(function(){
							this._playing = true;
							if(kara.subtitle)
							{
								var lyrics = path.join(this._options.path_subtitles, kara.subtitle);
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
							this._player.loadFile(path.join(__dirname,'__blank__.png'),'append');
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