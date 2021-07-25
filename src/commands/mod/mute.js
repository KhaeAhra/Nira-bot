const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      usage: 'mute <user mention/ID> <time> [reason]',
      description: `Coupe le son d'un utilisateur pendant la durée spécifiée (le maximum est de 14 jours)`,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['mute @Nettles 10s', 'mute @Nettles 30m talks too much']
    });
  }
  async run(message, args) {

    const muteRoleId = message.client.db.settings.selectMuteRoleId.pluck().get(message.guild.id);
    let muteRole;
    if (muteRoleId) muteRole = message.guild.roles.cache.get(muteRoleId);
    else return this.sendErrorMessage(message, 1, `Il n'y a actuellement aucun rôle muet défini sur ce service`);

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, `Veuillez mentionner un utilisateur ou fournir un identifiant d'utilisateur valide`);
    if (member === message.member)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous mettre en sourdine');
    if (member === message.guild.me) return this.sendErrorMessage(message, 0, 'Tu ne peux pas me mettre en sourdine');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, `Vous ne pouvez pas mettre en sourdine quelqu'un avec un rôle égal ou supérieure`);
    if (!args[1])
      return this.sendErrorMessage(message, 0, 'Veuillez saisir une durée de 14 jours ou moins (1s/m/h/d) ');
    let time = ms(args[1]);
    if (!time || time > 1209600000) // Cap at 14 days, larger than 24.8 days causes integer overflow
      return this.sendErrorMessage(message, 0, 'Veuillez saisir une durée de 14 jours ou moins (1s/m/h/d) ');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (member.roles.cache.has(muteRoleId))
      return this.sendErrorMessage(message, 0, 'À condition que le membre soit déjà mis en sourdine');

    // Mute member
    try {
      await member.roles.add(muteRole);
    } catch (err) {
      message.client.logger.error(err.stack);
      return this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
    }
    const muteEmbed = new MessageEmbed()
      .setTitle('Mute Member')
      .setDescription(`${member} a maintenant été mis en sourdine pendant **${ms(time, { long: true })}**.`)
      .addField('Moderator', message.member, true)
      .addField('Member', member, true)
      .addField('Time', `\`${ms(time)}\``, true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(muteEmbed);

    // Unmute member
    member.timeout = message.client.setTimeout(async () => {
      try {
        await member.roles.remove(muteRole);
        const unmuteEmbed = new MessageEmbed()
          .setTitle('Unmute Member')
          .setDescription(`${member} a été unMute.`)
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(unmuteEmbed);
      } catch (err) {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôle', err.message);
      }
    }, time);

    // Update mod log
    this.sendModLogMessage(message, reason, { Member: member, Time: `\`${ms(time)}\`` });
  }
};
