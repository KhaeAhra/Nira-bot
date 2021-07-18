const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: ['inv'],
    category: 'Utility',
    utilisation: '{prefix}invite <command name>',

execute(client, message, args) {
    
    message.delete();
    var embed = new Discord.MessageEmbed()
        .setTitle("𝑁𝑖𝑟𝑎")
        .setDescription("Ajoutez moi sur votre Serveur [Invite](https://discord.com/api/oauth2/authorize?client_id=860511373711638539&permissions=8&scope=bot)")
        .setColor(client.config.discord.color)
        .setThumbnail(client.config.discord.nira)
        message.channel.send({embed: embed});
    }
}