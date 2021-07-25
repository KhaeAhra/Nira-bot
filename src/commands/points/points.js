const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class PointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'points',
      aliases: ['p'],
      usage: 'points <user mention/ID>',
      description: `Récupère les points d'un utilisateur. Si aucun utilisateur n'est indiqué, vos propres points seront affichés.`,
      type: client.types.POINTS,
      examples: ['points @Nettles']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const points = message.client.db.users.selectPoints.pluck().get(member.id, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName} Points`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField('Membre', message.member, true)
      .addField('Points', `\`${points}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(member.displayHexColor);
    message.channel.send(embed);
  }
};
