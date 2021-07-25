const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      usage: 'kick <user mention/ID> [reason]',
      description: 'Expulse un membre de votre serveur.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      examples: ['kick @Nettles']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, `Veuillez mentionner un utilisateur ou fournir un identifiant d'utilisateur valide`);
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous expulse'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, `Vous ne pouvez pas expulser quelqu'un avec un rôle égal ou supérieur`);
    if (!member.kickable) 
      return this.sendErrorMessage(message, 0, 'À condition que le membre ne soit pas kickable');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await member.kick(reason);

    const embed = new MessageEmbed()
      .setTitle('Kick Member')
      .setDescription(`${member} was successfully kicked.`)
      .addField('Modr', message.member, true)
      .addField('Membre', member, true)
      .addField('Raison', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name} : ${message.author.tag} a expulsé ${member.user.tag}`);
    
    this.sendModLogMessage(message, reason, { Member: member});
  }
};
