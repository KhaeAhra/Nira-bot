const Discord = require("discord.js");

module.exports = {
    name: 'servinfo',
    aliases: ['servi'],
    owner: true,
    category: 'Owner',
    utilisation: '{prefix}servinfo <command name>',

execute(client, message, args) {

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":no_entry:  Tu n'as pas la permission d'utiliser cette commande.");
    let serverembed = new Discord.MessageEmbed()
    .setColor(client.config.discord.color)
    .setThumbnail(message.guild.iconURL())
    .addField("Nom:", message.guild.name, true)
    .addField("ID:", message.guild.id, true)
    .addField("Admin", message.guild.owner, true)
    .addField("AdminID", message.guild.ownerID, true)
    .addField("Region:", message.guild.region, true)
    .addField("Membres:", message.guild.memberCount, true)
    .addField("Rôles total", `${message.guild.memberCount}`, true)
    .addField("Channels:",`${message.guild.channels.cache.filter(m => m.type === 'text').size}`,true)
    .addField("Emojis", `${message.guild.emojis.cache.size}`, true)
    .addField("Vous avez rejoint le:", message.member.joinedAt, true)
    .setFooter(`Crée le ${message.guild.createdAt}`);

    message.channel.send(serverembed)

    message.delete()

}}
// ${message.guild.owner.user.tag} (${message.guild.owner.id})
// message.guild.owner.user.tag