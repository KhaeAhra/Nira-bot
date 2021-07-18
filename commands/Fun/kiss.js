const Discord = require("discord.js")
const kiss = require('../../data/kiss.json');

module.exports = {
    name: 'kiss',
    aliases: ['x'],
    category: 'Fun',
    utilisation: '{prefix}kiss <command name>',

execute(client, message, args) {

let bisou = kiss [Math.floor((Math.random() * kiss.length))];
    let member = message.mentions.members.first();
    if(!member) {

        let embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} envoi des kiss ! :kissing_heart:`)
        .setColor(client.config.discord.color)
        .setImage(bisou)
        message.channel.send(embed);
        message.delete()
        return;
    }

    let embed = new Discord.MessageEmbed()
        .setDescription(`${member}, ${message.author} t'embrasse chuu ! :kissing_heart:`)
        .setColor(client.config.discord.color)
        .setImage(bisou)
        message.channel.send(embed);
        message.delete();
        return;

}}