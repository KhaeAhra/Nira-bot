function loadPlayer(client, message) {

const fs = require("fs");
const player = fs.readdirSync('./player').filter(file => file.endsWith('.js'));for (const file of player) {
	// console.log(`Ready discord-player event ${file}`);
	const event = require(`../player/${file}`);
	client.player.on(file.split('.')[0], event.bind(null, client));
 }
}


module.exports = {
    loadPlayer,
   };