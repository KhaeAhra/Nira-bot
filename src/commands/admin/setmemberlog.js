const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetMemberLogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmemberlog',
      aliases: ['setmeml', 'smeml'],
      usage: 'setmemberlog <channel mention/ID>',
      description: oneLine`
      Définit le canal de texte de logs de d'arriver et de départ des membres pour votre serveur.`,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmemberlog #member-log']
    });
  }
  run(message, args) {
    const memberLogId = message.client.db.settings.selectMemberLogId.pluck().get(message.guild.id);
    const oldMemberLog = message.guild.channels.cache.get(memberLogId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`logs des membres\` a été mis à jour avec succès. ${emojis.success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateMemberLogId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Member Log', `${oldMemberLog} ➔ \`None\``));
    }

    const memberLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!memberLog || memberLog.type != 'text' || !memberLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
      Veuillez mentionner un channel ou une ID valide`);
    message.client.db.settings.updateMemberLogId.run(memberLog.id, message.guild.id);
    message.channel.send(embed.addField('Member Log', `${oldMemberLog} ➔ ${memberLog}`));
  }
};
