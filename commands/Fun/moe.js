const Discord = require("discord.js")
const moe = require('../../data/moe.json')

module.exports = {
    name: 'moe',
    aliases: ['cr'],
    category: 'Fun',
    utilisation: '{prefix}moe <command name>',

execute(client, message, args)  {

    let cute = moe[Math.floor((Math.random() * moe.length))];
    let member = message.mentions.members.first();
    if(!member) {

        let embed = new Discord.MessageEmbed()
        .setDescription(`${message.author} trouve ça... moe ! moe ! :flushed:`)
        .setColor(client.config.discord.color)
        .setImage(cute)
        message.channel.send(embed);
        message.delete()
        return;

    }

}}