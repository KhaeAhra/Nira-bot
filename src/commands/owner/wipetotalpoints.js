const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class WipeTotalPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wipetotalpoints',
      aliases: ['wipetp', 'wtp'],
      usage: 'wipetotalpoints <user mention/ID>',
      description: `Efface les points et le total des points de l'utilisateur fourni.`,
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['wipetotalpoints @Nettles']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, `Veuillez mentionner un utilisateur ou fournir un identifiant d'utilisateur valide`);
    message.client.db.users.wipeTotalPoints.run(member.id, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Effacer le nombre total de points')
      .setDescription(`Les points et le total des points de ${member} ont été effacés avec succès.`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  } 
};