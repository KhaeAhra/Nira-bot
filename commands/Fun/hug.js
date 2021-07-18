const Discord = require("discord.js")
const hug =require('../../data/hug.json')

module.exports = {
    name: 'hug',
    aliases: ['hu'],
    category: 'Fun',
    utilisation: '{prefix}hug <command name>',

execute(client, message, args) {
   
    let calin = hug[Math.floor((Math.random() * hug.length))];
    let member = message.mentions.members.first();
    if(!member) {

        let embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} dois se sentir seul(e) pour s'auto câliner ! :expressionless:`)
        .setColor(client.config.discord.color)
        .setImage(calin)
        message.channel.send(embed);
        message.delete()
        return;
    }

    let embed = new Discord.MessageEmbed()
        .setDescription(`${member}, ${message.author} Vous fait un câlin ! :heart:`)
        .setColor(client.config.discord.color)
        .setImage(calin)
        message.channel.send(embed);
        message.delete();
        return;

}}