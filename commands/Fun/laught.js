const Discord = require("discord.js")
const laught = require('../../data/laught.json')

module.exports = {
    name: 'laught',
    aliases: ['la'],
    category: 'Fun',
    utilisation: '{prefix}laught <command name>',

execute(client, message, args){

    let rire = laught[Math.floor((Math.random() * laught.length))];
    let member = message.mentions.members.first();
    if(!member) {

        let embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} :joy:` )
        .setColor(client.config.discord.color)
        .setImage(rire)
        message.channel.send(embed);
        message.delete()
        return;
    }
    let embed = new Discord.MessageEmbed()
        .setDescription(`${member}, ${message.author} Se moque de vous ! :joy:` )
        .setColor(client.config.discord.color)
        .setImage(rire)
        message.channel.send(embed);
        message.delete();
        return;
}}