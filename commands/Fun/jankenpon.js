const Discord = require("discord.js")

module.exports = {
    name: 'jankenpon',
    aliases: ['jkp'],
    category: 'Fun',
    utilisation: '{prefix}jankenpon <command name>',

execute(client, message, args){

    let rep = require('../../data/jkp.json');
    

    let repTaille = Math.floor((Math.random() * rep.length));
    let member = message.mentions.members.first();
    if(!member) {

        let embed = new Discord.MessageEmbed()
        .setDescription('Jan Ken Pon ! :raised_hand: :fist: :v:')
        .setColor(client.config.discord.color)
        .setImage(rep[repTaille])
        .setFooter(`Demande par: ${message.author.tag}`, message.author.avatarURL());
        message.channel.send(embed);
        message.delete()
        return;
    }

}}