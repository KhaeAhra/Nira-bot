const Discord = require('discord.js');

module.exports = {
    name: 'support',
    aliases: ['supp'],
    category: 'Owner',
    utilisation: '{prefix}support <command name>',

execute(client, message, args) {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":no_entry:  Tu n'as pas la permission d'utiliser cette commande.");
    message.delete();
    var embed = new Discord.MessageEmbed()
        .setTitle("Support")
        .setDescription(" Un problème avec le bot ? [Contactez le Support](https://docs.google.com/forms/d/e/1FAIpQLSfGfVcSFbdVOMMWykF1hNTXjoa6belAxCzbwD75Rm3NgZx5aw/viewform)")
        .setColor(client.config.discord.color)
        .setThumbnail(client.config.discord.nira)
        message.channel.send({embed: embed});
    }
}