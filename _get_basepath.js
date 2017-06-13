// récupère le chemin absolu vers l'applicatif lancé
// permet de résoudre le problème du finder MacOS qui execute dans l'environnement du dossier utilisateur

module.exports = function(testfile)
{
	const fs = require('fs');
	const path = require('path');
	const os = require('os')

	// try native node path vars __dirname first
	if(fs.existsSync(path.join(__dirname,testfile))){
		return __dirname;
	}

	// then try using alternative methods
	var basepath = process.argv[0];
	if(os.platform()=='win32')
	{
	    basepath = basepath.split('\\');
	    basepath = basepath.slice(0, basepath.length-1).join('\\')+'\\';
	}
	else
	{
	    basepath = basepath.split('/');
	    basepath = basepath.slice(0, basepath.length-1).join('/')+'/';
	}
	return basepath;
}