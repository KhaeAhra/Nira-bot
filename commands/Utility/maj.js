const Discord = require('discord.js');

module.exports = {
    name: 'maj',
    aliases: ['maj'],
    category: 'Utility',
    utilisation: '{prefix}maj <command name>',

execute(client, message, args) {

    message.delete();
    var embed = new Discord.MessageEmbed()
        .setTitle("Mise à jours & Maintenances")
        .setThumbnail(client.config.discord.nira)
        .setDescription("Toutes les informations")
        .addField(":date: | Mise à jour", "Entre 00h - 01h, régulièrement")
        .addField(":gear: | Maintenance", "Aucunes")
        .addField(":warning: | Problèmes", "Aucun")
        .addField(":no_entry_sign: | Pannes", "Aucunes")
        .setColor(client.config.discord.color)
        message.channel.send({embed: embed});
    }
}