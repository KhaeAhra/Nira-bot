const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      usage: 'ban <user mention/ID> [reason]',
      description: 'Banni un membre de votre serveu',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['ban @Nettles']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, `Veuillez mentionner un utilisateur ou fournir un identifiant d'utilisateur valide`);
    if (member === message.member)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous Ban'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, `Vous ne pouvez pas bannir quelqu'un avec un rôle égal ou supérieu`);
    if (!member.bannable)
      return this.sendErrorMessage(message, 0, 'À condition que le membre ne puisse pas être banni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    await member.ban({ reason: reason });

    const embed = new MessageEmbed()
      .setTitle('Ban Member')
      .setDescription(`${member} a été banni avec succès.`)
      .addField('Moderator', message.member, true)
      .addField('Member', member, true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} banni ${member.user.tag}`);
        
    // Update mod log
    this.sendModLogMessage(message, reason, { Member: member});
  }
};
