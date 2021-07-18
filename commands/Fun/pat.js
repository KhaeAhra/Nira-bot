const Discord = require("discord.js")
const pat = require('../../data/pat.json')

module.exports = {
    name: 'pat',
    aliases: ['pa'],
    category: 'Fun',
    utilisation: '{prefix}pat <command name>',

execute(client, message, args)  {

    let tape = pat[Math.floor((Math.random() * pat.length))];
    let member = message.mentions.members.first();
    if(!member) {
    
    let embed = new Discord.MessageEmbed()
    .setDescription(`${message.author} veux un pat pat ! :relaxed:`)
    .setColor(client.config.discord.color)
    .setImage(tape)
    message.channel.send(embed);
    message.delete()
    return;
    }
    let embed = new Discord.MessageEmbed()
        .setDescription(`${member}, ${message.author} Vous pat pat :relaxed:` )
        .setColor(client.config.discord.color)
        .setImage(tape)
        message.channel.send(embed);
        message.delete();
        return;
}}