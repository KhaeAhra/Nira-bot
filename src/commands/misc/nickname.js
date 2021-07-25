const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class NicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nickname',
      aliases: ['changenickname', 'nick', 'nn'],
      usage: 'nickname <nickname>',
      description: 'Remplace votre propre pseudo par celui spécifié. Le surnom ne peut pas dépasser 32 caractères.',
      type: client.types.MISC,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_NICKNAMES'],
      userPermissions: ['CHANGE_NICKNAME'],
      examples: ['nickname Billy Zane']
    });
  }
  async run(message, args) {

    if (!args[0]) return this.sendErrorMessage(message, 0, 'Please provide a nickname');
    const nickname = message.content.slice(message.content.indexOf(args[0]), message.content.length);

    if (nickname.length > 32) {
      return this.sendErrorMessage(message, 0, 'Veuillez vous assurer que le surnom ne dépasse pas 32 caractères');
    } else if (message.member === message.guild.owner) {
      return this.sendErrorMessage(message, 1, 'Unable to change the nickname of server owner');
    } else {
      try {

        // Change nickname
        const oldNickname = message.member.nickname || '`None`';
        const nicknameStatus = `${oldNickname} ➔ ${nickname}`;
        await message.member.setNickname(nickname);
        const embed = new MessageEmbed()
          .setTitle('Changer de Pseudo')
          .setDescription(`Le pseudo de ${message.member} a été mis à jour avec succès.`)
          .addField('Membre', message.member, true)
          .addField('pseudo', nicknameStatus, true)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôle', err.message);
      }
    }  
  }
};