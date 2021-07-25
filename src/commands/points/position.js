const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class PositionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'position',
      aliases: ['pos'],
      usage: 'position <user mention/ID>',
      description: oneLine`
      Récupère la position actuelle d'un utilisateur dans le classement.
      Si aucun utilisateur n'est indiqué, votre propre position sera affichée. 
      `,
      type: client.types.POINTS,
      examples: ['position @Nettles']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const leaderboard = message.client.db.users.selectLeaderboard.all(message.guild.id);
    const pos = leaderboard.map(row => row.user_id).indexOf(member.id) + 1;
    const ordinalPos = message.client.utils.getOrdinalNumeral(pos);
    const points = message.client.db.users.selectPoints.pluck().get(member.id, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName} Position`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${member} est à **${ordinalPos}** !`)
      .addField('Position', `\`${pos}\` de \`${message.guild.members.cache.size}\``, true)
      .addField('Points', `\`${points}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(member.displayHexColor);
    message.channel.send(embed);
  }
};
