const Discord = require('discord.js')

module.exports = {
    name: 'nira',
    aliases: ['ni'],
    category: 'Utility',
    utilisation: '{prefix}nira <command name>',

    execute(client, message, args) {
        
    const embed = new Discord.MessageEmbed() 
        .setColor(client.config.discord.color)
        .setAuthor("Liste des commandes!")
        .setThumbnail(client.config.discord.nira)
        .setDescription(` ${message.author} utilisez "n!"|exemple: n!avatar`)
        .addField(":8ball:| Fun:", "``8ball`` ``jankenpon`` ")
        .addField(":globe_with_meridians:| Social:", "``clap`` ``crazy`` ``cry`` ``dance`` ``hug`` ``kiss`` ``laught`` ``niom`` ``pat`` ``slap`` ``moe`` ") 
        .addField(":headphones:| Music", "``play`` ``stop`` ``skip`` ``queue`` ``np`` ``filter`` ``loop`` ``queue-clear`` ``pause`` ``resume`` ``search`` ``shuffle`` ``volume`` ``w-filters`` ``listfilters`` ") 
        .addField(":wrench: Utilitaire:", "``avatar`` ``invite`` ``maj`` ``weather`` ``patch``")
        .addField(":beginner:| Admin:", "``botinfo`` ``clear`` ``ping`` ``say`` ``servinfo`` ``servlist`` ``support`` ``verifchannel`` ") 
        .setFooter(" Utilisez n!maj pour toutes informations et Maintenance")
        message.delete()
        message.channel.send(embed) 
        
    },
}









