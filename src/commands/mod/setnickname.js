const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetNicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setnickname',
      aliases: ['setnn', 'snn'],
      usage: 'setnickname <user mention/ID> <nickname> [reason]',
      description: oneLine`
      Remplace le pseudonyme de l'utilisateur fourni par celui spécifié.
      Entourez le nouveau surnom de guillemets s'il contient plus d'un mot.
      Le surnom ne peut pas dépasser 32 caractères.
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_NICKNAMES'],
      userPermissions: ['MANAGE_NICKNAMES'],
      examples: ['setnickname @Nettles Noodles', 'setnickname @Nettles "Val Kilmer"']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, `Veuillez mentionner un utilisateur ou fournir un identifiant d'utilisateur valide`);
    if (member.roles.highest.position >= message.member.roles.highest.position && member != message.member)
      return this.sendErrorMessage(message, 0, stripIndent`
      Vous ne pouvez pas changer le surnom de quelqu'un avec un rôle égal ou supérie
      `);

    if (!args[1]) return this.sendErrorMessage(message, 0, 'Veuillez fournir un surnom');

    // Multi-word nickname
    let nickname = args[1];
    if (nickname.startsWith('"')) {
      nickname = message.content.slice(message.content.indexOf(args[1]) + 1);
      if (!nickname.includes('"')) 
        return this.sendErrorMessage(message, 0, 'Veuillez vous assurer que le surnom est entouré de guillemets');
      nickname = nickname.slice(0, nickname.indexOf('"'));
      if (!nickname.replace(/\s/g, '').length) return this.sendErrorMessage(message, 0, 'Veuillez fournir un surnom');
    }

    if (nickname.length > 32) {
      return this.sendErrorMessage(message, 0, 'Veuillez vous assurer que le surnom ne dépasse pas 32 caractères');
      
    } else {

      let reason;
      if (args[1].startsWith('"')) 
        reason = message.content.slice(message.content.indexOf(nickname) + nickname.length + 1);
      else reason = message.content.slice(message.content.indexOf(nickname) + nickname.length);
      if (!reason) reason = '`None`';
      if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

      try {

        // Change nickname
        const oldNickname = member.nickname || '`None`';
        const nicknameStatus = `${oldNickname} ➔ ${nickname}`;
        await member.setNickname(nickname);
        const embed = new MessageEmbed()
          .setTitle('Set Nickname')
          .setDescription(`${member}'s nickname was successfully updated.`)
          .addField('Modor', message.member, true)
          .addField('Membre', member, true)
          .addField('Pseudo', nicknameStatus, true)
          .addField('Raison', reason)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);

        // Update mod log
        this.sendModLogMessage(message, reason, { Member: member, Nickname: nicknameStatus });

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
      }
    }  
  }
};