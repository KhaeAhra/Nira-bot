
function loadEvents(client) {

const fs = require("fs");
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of events) {
	// console.log(`Ready discord.js event ${file}`);
	const event = require(`../events/${file}`);
	client.on(file.split('.')[0], event.bind(null, client));
 }
}

module.exports = {
    loadEvents,
   };
 