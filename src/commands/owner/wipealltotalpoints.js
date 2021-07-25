const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class WipeAllTotalPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wipealltotalpoints',
      aliases: ['wipeatp', 'watp'],
      usage: 'wipealltotalpoints <server ID>',
      description: `Efface les points de tous les membres et le nombre total de points sur le serveur avec l'ID fourni`,
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['wipealltotalpoints 709992782252474429']
    });
  }
  run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId))
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un identifiant de serveur valide');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 0, `Impossible de trouver le serveur, veuillez vérifier l'ID fourni`);
    message.client.db.users.wipeAllTotalPoints.run(guildId);
    const embed = new MessageEmbed()
      .setTitle('Effacer tous les points totaux')
      .setDescription(`Les points et le total des points de **${guild.name}** ont été effacés avec succès.`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  } 
};