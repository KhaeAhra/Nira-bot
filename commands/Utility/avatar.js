const Discord = require('discord.js')


module.exports = {
    name: 'avatar',
    aliases: ['a'],
    category: 'Utility',
    utilisation: '{prefix}avatar <command name>', 

    execute(client, message, args) {
        
    message.delete();
    const myavatarEmbed = new Discord.MessageEmbed()
        .setColor(client.config.discord.color)
        .setDescription(`:busts_in_silhouette:| Avatar de ${message.author} `)
        .setImage (message.author.avatarURL())
        .setFooter(`Demande par: ${message.author.tag}`, message.author.avatarURL())
        if (!message.mentions.users.size) {
            return message.channel.send(myavatarEmbed);    
        }
        

        var user = message.mentions.users.first();
        const avatarEmbed = new Discord.MessageEmbed()
        .setColor(client.config.discord.color)
        .setDescription (`:busts_in_silhouette:| Avatar de ${user}`)
        .setImage (user.displayAvatarURL())
        .setFooter(`Demande par: ${message.author.tag}`, message.author.avatarURL())
        message.channel.send(avatarEmbed)}
    
    }
    
