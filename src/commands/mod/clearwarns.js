const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ClearWarnsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearwarns',
      usage: 'clearwarns <user mention/ID> [reason]',
      description: 'Efface tous les avertissements du membre.',
      type: client.types.MOD,
      userPermissions: ['KICK_MEMBERS'],
      examples: ['clearwarns @Nettles']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, `Veuillez mentionner un utilisateur ou fournir un identifiant d'utilisateur valide`);
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas effacer vos propres avertissements'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, `Vous ne pouvez pas effacer les avertissements de quelqu'un avec un rôle égal ou supérieur`);

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    message.client.db.users.updateWarns.run('', member.id, message.guild.id);

    const embed = new MessageEmbed()
      .setTitle('Clear Warns')
      .setDescription(`Les avertissements de ${member} ont été effacés avec succès.`)
      .addField('Modo', message.member, true)
      .addField('Membre', member, true)
      .addField('Warn Count', '`0`', true)
      .addField('Raison', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(oneLine`
      ${message.guild.name}: ${message.author.tag} a effacé l'avertissement de ${member.user.tag}
    `);
    
    this.sendModLogMessage(message, reason, { Member: member, 'Warn Count': '`0`' });
  }
};
