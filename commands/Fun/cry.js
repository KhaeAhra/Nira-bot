const Discord = require("discord.js")
const cry = require('../../data/cry.json')

module.exports = {
    name: 'cry',
    aliases: ['cr'],
    category: 'Fun',
    utilisation: '{prefix}cry <command name>',

execute(client, message, args)  {
    
    let pleure = cry[Math.floor((Math.random() * cry.length))];
    let member = message.mentions.members.first();
    if(!member) {

        let embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} Pleure ! :sob:`)
        .setColor(client.config.discord.color)
        .setImage(pleure)
        message.channel.send(embed);
        message.delete()
        return;
    }

}}