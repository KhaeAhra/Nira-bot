const Discord = require("discord.js")
const crazy = require('../../data/crazy.json')

module.exports = {
    name: 'crazy',
    aliases: ['cra'],
    category: 'Fun',
    utilisation: '{prefix}crazy <command name>',

execute(client, message, args)  {
    
    let fou = crazy [Math.floor((Math.random() * crazy.length))];
    let member = message.mentions.members.first();
    if(!member) {

        let embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} est Psychopathe ! :scream:`)
        .setColor(client.config.discord.color)
        .setImage(fou)
        message.channel.send(embed);
        message.delete()
        return;
    }

    let embed = new Discord.MessageEmbed()
        .setDescription(`${member}, ${message.author} dit que vous êtes psychopathe ! :scream:` )
        .setColor(client.config.discord.color)
        .setImage(fou)
        message.channel.send(embed);
        message.delete();
        return;
}}