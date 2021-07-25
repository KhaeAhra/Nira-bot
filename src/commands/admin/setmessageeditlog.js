const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis  = require('../../../dataJson/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetMessageEditLogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmessageeditlog',
      aliases: ['setmsgeditlog', 'setmel', 'smel'],
      usage: 'setmessageeditlog <channel mention/ID>',
      description: oneLine`
      Définit le canal de texte des logs de modification des messages pour votre serveur.`,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmessageeditlog #bot-log']
    });
  }
  run(message, args) {
    const messageEditLogId = message.client.db.settings.selectMessageEditLogId.pluck().get(message.guild.id);
    const oldMessageEditLog = message.guild.channels.cache.get(messageEditLogId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`logs d'édition des messages\` a été mis à jour avec succès.  ${emojis.success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateMessageEditLogId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Message Edit Log', `${oldMessageEditLog} ➔ \`None\``));
    }

    const messageEditLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!messageEditLog || messageEditLog.type != 'text' || !messageEditLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text channel or provide a valid text channel ID
      `);
    message.client.db.settings.updateMessageEditLogId.run(messageEditLog.id, message.guild.id);
    message.channel.send(embed.addField('Message Edit Log', `${oldMessageEditLog} ➔ ${messageEditLog}`));
  }
};
