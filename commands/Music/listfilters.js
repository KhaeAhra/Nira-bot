const Discord = require('discord.js')

module.exports = {
    name: 'listfilters',
    aliases: ['listfil'],
    category: 'Music',
    utilisation: '{prefix}listfilters <command name>',

    execute(client, message, args) {

        message.delete();
    const embed = new Discord.MessageEmbed() 
        .setColor(client.config.discord.color)
        .setAuthor("Liste des Filtres!")
        .setDescription("Utilisez n!filter [+filter] exemple n!filter 8D")
        .setTimestamp()
        .addField(":control_knobs: | Filter:", "``8D``, ``gate``, ``haas``, ``phaser``, ``treble``, ``tremolo``, ``vibrato``, ``reverse``, ``karaoke``, ``flanger'``, ``mcompand``, ``pulsator``, ``subboost``, ``bassboost``, ``vaporwave``, ``nightcore``, ``normalizer``, ``surrounding`` ")
        .setFooter("Vous devez être dans un salon vocal et avoir lancée une musique")
        message.delete()
        message.channel.send(embed) 
        
    },
}