const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class WipeAllPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wipeallpoints',
      aliases: ['wipeap', 'wap'],
      usage: 'wipeallpoints <server ID>',
      description: `Efface tous les points des membres sur le serveur avec l'ID fourni`,
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['wipeallpoints 709992782252474429']
    });
  }
  run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId)) 
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un identifiant de serveur valide');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 0, `Impossible de trouver le serveur, veuillez vérifier l'ID fourni`);
    message.client.db.users.wipeAllPoints.run(guildId);
    const embed = new MessageEmbed()
      .setTitle('Effacer tous les points')
      .setDescription(`Les points de **${guild.name}** ont bien été effacés.`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  } 
};