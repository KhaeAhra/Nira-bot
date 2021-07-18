// --------------Main----------------------------
// const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({ disableMentions: 'everyone' });
const { Player } = require('discord-player');
//--------------Client---------------------------
client.player = new Player(client);
client.config = require('./config/bot');
client.emotes = client.config.emojis;
client.filters = client.config.filters;
client.translate = require('./config/translate');
client.days = client.translate.days;
client.meteo = client.translate.meteo;
client.commands = new Discord.Collection();
//--------------reading--------------------------- 
const { loadCommands } = require('./handler/loadCommands');
const { loadEvents }  = require("./handler/loadEvents");
const { loadPlayer } = require("./handler/loadPlayer");
loadCommands(client);
loadEvents(client);
loadPlayer(client);
//------------------------------------------------
// fs.readdirSync('./commands').forEach(dirs => {
//     const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

//     for (const file of commands) {
//         const command = require(`./commands/${dirs}/${file}`);
//         // console.log(`Loading command ${file}`);
//         client.commands.set(command.name.toLowerCase(), command);
//     };
// });

// const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
// const player = fs.readdirSync('./player').filter(file => file.endsWith('.js'));

// for (const file of events) {
//     // console.log(`Loading discord.js event ${file}`);
//     const event = require(`./events/${file}`);
//     client.on(file.split(".")[0], event.bind(null, client));
// };

// for (const file of player) {
//     // console.log(`Loading discord-player event ${file}`);
//     const event = require(`./player/${file}`);
//     client.player.on(file.split(".")[0], event.bind(null, client));
// };
//--------------TOKEN---------------------------
// client.login(client.config.discord.token);
client.login(process.env.token);