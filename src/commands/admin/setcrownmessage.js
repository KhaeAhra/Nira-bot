const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetCrownMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownmessage',
      aliases: ['setcrownmsg', 'setcm', 'scm'],
      usage: 'setcrownmessage <message>',
      description: oneLine`
      Définit le message que NIra dira pendant la rotation du rôle de la Crown.
      Vous pouvez utiliser \`?member\` pour remplacer une mention d'utilisateur ,
      \`?nom d'utilisateur\` pour remplacer le nom d'utilisateur de quelqu'un,
      \`?tag\` pour remplacer le tag Discord complet de quelqu'un (nom d'utilisateur + discriminateur),
      \`?role\` pour remplacer le \`rôle de Crown\`,
      et \`?points\` pour remplacer les points actuels du vainqueur.
      N'entrez aucun message pour effacer le \`message de Crown\` actuel.
      Un \`message de Crown\` ne sera envoyé que si un \`canal de Crown\`, un \`rôle de Crown\` et un \`programme de Crown\` sont définis. 
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownmessage ?member has won the ?role!']
    });
  }
  run(message, args) {
    const { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_schedule: crownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    const crownRole = message.guild.roles.cache.get(crownRoleId);
    const crownChannel = message.guild.channels.cache.get(crownChannelId);

    // Get status
    const status = message.client.utils.getStatus(crownRoleId, crownSchedule);

    const embed = new MessageEmbed()
      .setTitle('Paramètre: `Crown`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`message de la couronne\` a été mis à jour avec succès. ${emojis.success}`)
      .addField('Role', crownRole || '`None`', true)
      .addField('Channel', crownChannel || '`None`', true)
      .addField('Schedule', `\`${(crownSchedule) ? crownSchedule : 'None'}\``, true)
      .addField('Status', `\`${status}\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear message
    if (!args[0]) {
      message.client.db.settings.updateCrownMessage.run(null, message.guild.id);
      return message.channel.send(embed.addField('Message', '`None`')
      );
    }

    let crownMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateCrownMessage.run(crownMessage, message.guild.id);
    if (crownMessage.length > 1024) crownMessage = crownMessage.slice(0, 1021) + '...';
    message.channel.send(embed.addField('Message', message.client.utils.replaceCrownKeywords(crownMessage))
    );
  }
};