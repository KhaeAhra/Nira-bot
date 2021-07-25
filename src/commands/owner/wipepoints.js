const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class WipePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wipepoints',
      aliases: ['wipep', 'wp'],
      usage: 'wipepoints <user mention/ID>',
      description: `Efface les points de l'utilisateur fournis.`,
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['wipepoints @Nettles']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, `Veuillez mentionner un utilisateur ou fournir un identifiant d'utilisateur valide`);
    message.client.db.users.wipePoints.run(member.id, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Points éffacés')
      .setDescription(`Les points de ${member} ont été effacés avec succès.`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  } 
};