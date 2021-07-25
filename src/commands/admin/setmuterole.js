const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');

module.exports = class SetMuteRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmuterole',
      aliases: ['setmur', 'smur'],
      usage: 'setmuterole <role mention/ID>',
      description: 'Définit le « rôle muet » de votre serveur.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmuterole @Muted']
    });
  }
  run(message, args) {
    const muteRoleId = message.client.db.settings.selectMuteRoleId.pluck().get(message.guild.id);
    const oldMuteRole = message.guild.roles.cache.find(r => r.id === muteRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`rôle muet\` a été mis à jour avec succès. ${emojis.success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateMuteRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Mute Role', `${oldMuteRole} ➔ \`None\``));
    }

    // Update role
    const muteRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!muteRole) return this.sendErrorMessage(message, 0, 'Veuillez mentionner un rôle ou fournir un ID de rôle valide ');
    message.client.db.settings.updateMuteRoleId.run(muteRole.id, message.guild.id);
    message.channel.send(embed.addField('Mute Role', `${oldMuteRole} ➔ ${muteRole}`));
  }
};
