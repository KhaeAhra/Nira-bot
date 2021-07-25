const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setwelcomemessage',
      aliases: ['setwelcomemsg', 'setwm', 'swm'],
      usage: 'setwelcomemessage <message>',
      description: oneLine`
      Définit le message que Nira dira lorsque quelqu'un rejoint votre serveur.
      Vous pouvez utiliser \`?member\` pour remplacer une mention d'utilisateur,
         \`?nom d'utilisateur\` pour remplacer le nom d'utilisateur de quelqu'un,
         \`?tag\` pour remplacer le tag Discord complet de quelqu'un (nom d'utilisateur + discriminateur),
         et \`?size\` pour remplacer le nombre actuel de membres de votre serveur.
         N'entrez aucun message pour effacer le \`message de bienvenue\` actuel.
         Un \`canal de bienvenue\` doit également être défini pour activer les messages de bienvenue. 
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setwelcomemessage ?member has joined the server!']
    });
  }
  run(message, args) {

    const { welcome_channel_id: welcomeChannelId, welcome_message: oldWelcomeMessage } = 
      message.client.db.settings.selectWelcomes.get(message.guild.id);
    let welcomeChannel = message.guild.channels.cache.get(welcomeChannelId);

    // Get status
    const oldStatus = message.client.utils.getStatus(welcomeChannelId, oldWelcomeMessage);

    const embed = new MessageEmbed()
      .setTitle('Settings: `Welcomes`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`message de bienvenue\` a été mis à jour avec succès.  ${emojis.success}`)
      .addField('Channel', welcomeChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateWelcomeMessage.run(null, message.guild.id);

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send(embed
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      );
    }
    
    let welcomeMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateWelcomeMessage.run(welcomeMessage, message.guild.id);
    if (welcomeMessage.length > 1024) welcomeMessage = welcomeMessage.slice(0, 1021) + '...';

    // Update status
    const status =  message.client.utils.getStatus(welcomeChannel, welcomeMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send(embed
      .addField('Status', statusUpdate, true)
      .addField('Message', message.client.utils.replaceKeywords(welcomeMessage))
    );
  }
};