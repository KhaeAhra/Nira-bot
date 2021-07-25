const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class WarnPurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warnpurge',
      aliases: ['purgewarn'],
      usage: 'warnpurge <user mention/ID> <message count> [reason]',
      description: 'Avertit un membre de votre serveur, puis purge ses messages du nombre de messages fourni.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS', 'MANAGE_MESSAGES'],
      userPermissions: ['KICK_MEMBERS', 'MANAGE_MESSAGES'],
      examples: ['warnpurge @Nettles 50']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, `Veuillez mentionner un utilisateur ou fournir un identifiant d'utilisateur valide`);
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous avertir '); 
    if (member.roles.highest.position >= message.member.roles.highest.position) 
      return this.sendErrorMessage(message, 0, `Vous ne pouvez pas avertir quelqu'un avec un rôle égal ou supérieur`);
    
    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id); // Get warn # for auto kick

    const amount = parseInt(args[1]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un nombre de messages compris entre 1 et 100');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    // Warn
    let warns = message.client.db.users.selectWarns.pluck().get(member.id, message.guild.id) || { warns: [] };
    if (typeof(warns) == 'string') warns = JSON.parse(warns);
    const warning = {
      mod: message.member.id,
      date:  moment().format('MMM DD YYYY'),
      reason: reason
    };

    warns.warns.push(warning);
  
    message.client.db.users.updateWarns.run(JSON.stringify(warns), member.id, message.guild.id);

    // Purge
    const messages = (await message.channel.messages.fetch({ limit: amount })).filter(m => m.member.id === member.id);
    if (messages.size > 0) await message.channel.bulkDelete(messages, true);  

    const embed = new MessageEmbed()
      .setTitle('Warnpurge Member')
      .setDescription(`${member} a été averti, avec **${messages.size}** messages purgés.`)
      .addField('Modo', message.member, true)
      .addField('Membre', member, true)
      .addField('Normbres de warns', `\`${warns.warns.length}\``, true)
      .addField('nombres de messages éffacés', `\`${messages.size}\``, true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name} : ${message.author.tag} a purgé ${member.user.tag}`);
    
    // Update mod log
    this.sendModLogMessage(message, reason, { 
      Member: member, 
      'Warn Count': `\`${warns.warns.length}\``,
      'Found Messages': `\`${messages.size}\``
    });

    // Check for auto kick
    if (autoKick && warns.warns.length === autoKick) {
      message.client.commands.get('kick')
        .run(message, [member.id, `Limite d'avertissement atteinte. Expulsé automatiquement par ${message.guild.me}`]);
    }

  }
};
