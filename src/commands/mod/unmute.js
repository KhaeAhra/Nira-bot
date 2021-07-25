const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class UnmuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unmute',
      usage: 'unmute <user mention/ID>',
      description: `Rétablit le son de l'utilisateur spécifié.`,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['unmute @Nettles']
    });
  }
  async run(message, args) {
    const muteRoleId = message.client.db.settings.selectMuteRoleId.pluck().get(message.guild.id);
    let muteRole;
    if (muteRoleId) muteRole = message.guild.roles.cache.get(muteRoleId);
    else return this.sendErrorMessage(message, 1, `Il n'y a actuellement aucun rôle muet défini sur ce serveur`);

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, `Veuillez mentionner un utilisateur ou fournir un identifiant d'utilisateur valide`);
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, `Vous ne pouvez pas réactiver quelqu'un avec un rôle égal ou supérieur`);

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    if (!member.roles.cache.has(muteRoleId)) 
      return this.sendErrorMessage(message, 0, 'Provided member is not muted');
    
    // Unmute member
    message.client.clearTimeout(member.timeout);
    try {
      await member.roles.remove(muteRole);
      const embed = new MessageEmbed()
        .setTitle('Unmute Member')
        .setDescription(`${member} a été rétabli.`)
        .addField('Raison', reason)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      return this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
    }
    
    this.sendModLogMessage(message, reason, { Member: member });
  }
};
