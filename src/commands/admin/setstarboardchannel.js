const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetStarboardChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setstarboardchannel',
      aliases: ['setstc', 'sstc'],
      usage: 'setstarboardchannel <channel mention/ID>',
      description: oneLine`
        Dd&finit un starboard pour votre serveur.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setstarboardchannel #starboard']
    });
  }
  run(message, args) {
    const starboardChannelId = message.client.db.settings.selectStarboardChannelId.pluck().get(message.guild.id);
    const oldStarboardChannel = message.guild.channels.cache.get(starboardChannelId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Starboard`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`Starboard\` a été mis à jour avec succè ${emojis.success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateStarboardChannelId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Starboard Channel', `${oldStarboardChannel} ➔ \`None\``));
    }

    const starboardChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (
      !starboardChannel || 
      (starboardChannel.type != 'text' && starboardChannel.type != 'news') || 
      !starboardChannel.viewable
    ) {
      return this.sendErrorMessage(message, 0, stripIndent`
      Donnez un channel ou une ID valide
      `);
    }
    message.client.db.settings.updateStarboardChannelId.run(starboardChannel.id, message.guild.id);
    message.channel.send(embed.addField('Starboard Channel', `${oldStarboardChannel} ➔ ${starboardChannel}`));
  }
};
