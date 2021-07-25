const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetSystemChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setsystemchannel',
      aliases: ['setsc', 'ssc'],
      usage: 'setsystemchannel <channel mention/ID>',
      description: oneLine`
      Définit le canal de texte système pour votre serveur. C'est là que les messages système de Nira seront envoyés.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setsystemchannel #general']
    });
  }
  run(message, args) {
    const systemChannelId = message.client.db.settings.selectSystemChannelId.pluck().get(message.guild.id);
    const oldSystemChannel = message.guild.channels.cache.get(systemChannelId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`canal système\` a été mis à jour avec succès.  ${emojis.success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateSystemChannelId.run(null, message.guild.id);
      return message.channel.send(embed.addField('System Channel', `${oldSystemChannel} ➔ \`None\``));
    }

    const systemChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!systemChannel || (systemChannel.type != 'text' && systemChannel.type != 'news') || !systemChannel.viewable)
      return this.sendErrorMessage(message, 0, stripIndent`
      Donnez un channel ou une ID valide
      `);
    message.client.db.settings.updateSystemChannelId.run(systemChannel.id, message.guild.id);
    message.channel.send(embed.addField('System Channel', `${oldSystemChannel} ➔ ${systemChannel}`));
  }
};
