const Discord = require("discord.js")
const slap = require('../../data/slap.json')

module.exports = {
    name: 'slap',
    aliases: ['sl'],
    category: 'Fun',
    utilisation: '{prefix}slap<command name>',

execute(client, message, args) {

    let taper = slap[Math.floor((Math.random() * slap.length))];
    let member = message.mentions.members.first();
    if(!member) {

        let embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} s'auto frappe !`)
        .setColor(client.config.discord.color)
        .setImage(taper)
        message.channel.send(embed);
        message.delete()
        return;
    }

    let embed = new Discord.MessageEmbed()
        .setDescription(`${member}, ${message.author} vous frappe !`)
        .setColor(client.config.discord.color)
        .setImage(taper)
        message.channel.send(embed);
        message.delete();
        return;
}}