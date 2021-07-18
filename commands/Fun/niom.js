const Discord = require("discord.js")
const niom = require('../../data/niom.json')

module.exports = {
    name: 'niom',
    aliases: ['ni'],
    category: 'Fun',
    utilisation: '{prefix}niom <command name>',

execute(client, message, args){

    let mange = niom[Math.floor((Math.random() * niom.length))];
    let member = message.mentions.members.first();
    if(!member) {

        let embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} s'auto mange O_O`)
        .setColor(client.config.discord.color)
        .setImage(mange)
        message.channel.send(embed);
        message.delete()
        return;
    }

    let embed = new Discord.MessageEmbed()
        .setDescription(`${member}, ${message.author} vous mange, niom !`)
        .setColor(client.config.discord.color)
        .setImage(mange)
        message.channel.send(embed);
        message.delete();
        return;
}}