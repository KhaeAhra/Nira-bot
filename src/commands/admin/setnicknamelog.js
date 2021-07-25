const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis= require('../../../dataJson/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetNicknameLogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setnicknamelog',
      aliases: ['setnnl', 'snnl'],
      usage: 'setnicknamelog <channel mention/ID>',
      description: oneLine`
      Définit le canal de texte des logsl des changements de pseudonyme pour votre serveur
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setnicknamelog #bot-log']
    });
  }
  run(message, args) {
    const nicknameLogId = message.client.db.settings.selectNicknameLogId.pluck().get(message.guild.id);
    const oldNicknameLog = message.guild.channels.cache.get(nicknameLogId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`journal des surnoms\` a été mis à jour avec succès ${emojis.success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateNicknameLogId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Nickname Log', `${oldNicknameLog} ➔ \`None\``));
    }

    const nicknameLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!nicknameLog || nicknameLog.type != 'text' || !nicknameLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
      Donnez un channel ou une ID valide
      `);
    message.client.db.settings.updateNicknameLogId.run(nicknameLog.id, message.guild.id);
    message.channel.send(embed.addField('Nickname Log', `${oldNicknameLog} ➔ ${nicknameLog}`));
  }
};
