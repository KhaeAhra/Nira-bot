const Discord = require("discord.js");

module.exports = {
    name: 'botinfo',
    aliases: ['boti'],
    owner: true,
    category: 'Owner',
    utilisation: '{prefix}botinfo <command name>',

execute(client, message, args) {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":no_entry:  Tu n'as pas la permission d'utiliser cette commande.");
    let clientembed = new Discord.MessageEmbed()
    .setColor(client.config.discord.color)
    .setThumbnail(client.config.discord.nira)
    .addField(":bust_in_silhouette: Nom client:", `${client.user.username}`, true)
    .addField(":beginner: Créer par:", "Anörr")
    .addField("🛡 Servers:", `${client.guilds.cache.size}`, true)
    .addField(":busts_in_silhouette: Utilisateurs:", `${client.users.cache.size}`, true)
    .addField(`:books: Library:`, `[discord.js](https://discord.js.org/#/)`, true)
    .addField("Crée le:", client.user.createdAt)
    .setFooter(`Informations sur: ${client.user.username}.`)
    .setTimestamp()
    
    message.channel.send(clientembed);
    message.delete();
}}