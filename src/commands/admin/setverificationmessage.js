const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetVerificationMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setverificationmessage',
      aliases: ['setverificationmsg', 'setvm', 'svm'],
      usage: 'setverificationmessage <message>',
      description: oneLine`
      Définit le message que Nira publiera dans le \`canal de vérification\`.
      `,
      type: client.types.ADMIN,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setverificationmessage Veuillez lire les règles du serveur, puis réagir à ce message .']
    });
  }
  async run(message, args) {

    let { 
      verification_role_id: verificationRoleId,
      verification_channel_id: verificationChannelId, 
      verification_message: oldVerificationMessage,
      verification_message_id: verificationMessageId 
    } = message.client.db.settings.selectVerification.get(message.guild.id);
    const verificationRole = message.guild.roles.cache.get(verificationRoleId);
    const verificationChannel = message.guild.channels.cache.get(verificationChannelId);

    // Get status
    const oldStatus = message.client.utils.getStatus(
      verificationRoleId && verificationChannelId && oldVerificationMessage
    );

    const embed = new MessageEmbed()
      .setTitle('Settings: `Verification`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`message de vérification\` a été mis à jour avec succès. ${emojis.success}`)
      .addField('Role', verificationRole || '`None`', true)
      .addField('Channel', verificationChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateVerificationMessage.run(null, message.guild.id);
      message.client.db.settings.updateVerificationMessageId.run(null, message.guild.id);

      if (verificationChannel && verificationMessageId) {
        try {
          await verificationChannel.messages.delete(verificationMessageId);
        } catch (err) { // Message was deleted
          message.client.logger.error(err);
        }
      }

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send(embed
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      );
    }
    
    let verificationMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateVerificationMessage.run(verificationMessage, message.guild.id);
    if (verificationMessage.length > 1024) verificationMessage = verificationMessage.slice(0, 1021) + '...';

    // Update status
    const status =  message.client.utils.getStatus(verificationRole && verificationChannel && verificationMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send(embed
      .addField('Status', statusUpdate, true)
      .addField('Message', verificationMessage)
    );

    // Update verification
    if (status === 'enabled') {
      if (verificationChannel.viewable) {
        try {
          await verificationChannel.messages.fetch(verificationMessageId);
        } catch (err) { // Message was deleted
          message.client.logger.error(err);
        }
        const msg = await verificationChannel.send(new MessageEmbed()
          .setDescription(verificationMessage)
          .setColor(message.guild.me.displayHexColor)
        );
        await msg.react(verify.split(':')[2].slice(0, -1));
        message.client.db.settings.updateVerificationMessageId.run(msg.id, message.guild.id);
      } else {
        return message.client.sendSystemErrorMessage(message.guild, 'verification', stripIndent`
        Impossible d'envoyer le message de vérification, veuillez vous assurer que j'ai l'autorisation d'accéder au canal de vérification
        `);
      }
    }
  }
};