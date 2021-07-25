const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetRoleLogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setrolelog',
      aliases: ['setrl', 'srl'],
      usage: 'setrolelog <channel mention/ID>',
      description: oneLine`
      Définit le canal de texte de logs des changements de rôle pour votre serveur..
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setrolelog #bot-log']
    });
  }
  run(message, args) {
    const roleLogId = message.client.db.settings.selectRoleLogId.pluck().get(message.guild.id);
    const oldRoleLog = message.guild.channels.cache.get(roleLogId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`rôle log\` a été mis à jour avec succès. ${emojis.success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateRoleLogId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Role Log', `${oldRoleLog} ➔ \`None\``));
    }

    const roleLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!roleLog || roleLog.type != 'text' || !roleLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Donnez un channel ou une ID valide
      `);
    message.client.db.settings.updateRoleLogId.run(roleLog.id, message.guild.id);
    message.channel.send(embed.addField('Role Log', `${oldRoleLog} ➔ ${roleLog}`));
  }
};
