var path = require('path');

var player = require('./index.js')({
	path_karas:path.resolve(__dirname,'./samples/karas'),
	path_lyrics:path.resolve(__dirname,'./samples/lyrics'),
	path_videos:path.resolve(__dirname,'./samples/videos'),
});

/*
// on peux ajouter les kara un par un
// player.addKara(@kara_file, $kara_id)
// @kara_file : nom du fichier kara à utiliser
// @k_id : identifiant unique du kara dans la base de données (optionnel)
player.addKara('JAP - Dragon Ball - OP - Maka fushigi Adventure.kara',1);
player.addKara('JAP - Dragon Ball Z - OP1 - Cha-la Head Cha-la.kara',2);
player.play();
*/

// ou charger directement une playlist complete
// le gestionnaire de playlist pourra donc fournir directement un tableau listant les fichier kara à charger
player.setPlaylist([
	{file:'JAP - Dragon Ball - OP - Maka fushigi Adventure.kara', id:1},
	{file:'JAP - Dragon Ball Z - OP1 - Cha-la Head Cha-la.kara', id:2}
]);
player.play();

console.log('Press any key to play next kara');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.once('data', function(){
	player.next();
	console.log('Press any key to exit');
	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.once('data', process.exit.bind(process, 0));
});