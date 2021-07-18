const Discord = require("discord.js")
const dance = require('../../data/dance.json')

module.exports = {
    name: 'dance',
    aliases: ['da'],
    category: 'Fun',
    utilisation: '{prefix}dance <command name>',

execute(client, message, args) {
   
    let danse = dance[Math.floor((Math.random() * dance.length))];
    let member = message.mentions.members.first();
    if(!member) {

        let embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} danse ! :man_dancing:`)
        .setColor(client.config.discord.color)
        .setImage(danse)
        message.channel.send(embed);
        message.delete()
        return;
    }

    let embed = new Discord.MessageEmbed()
        .setDescription(`${member}, ${message.author} vous entraîne dans la danse ! :man_dancing:`)
        .setColor(client.config.discord.color)
        .setImage(danse)
        message.channel.send(embed);
        message.delete();
        return;
        
}}