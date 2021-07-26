const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetFarewellMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setfarewellmessage',
      aliases: ['setfarewellmsg', 'setfm', 'sfm'],
      usage: 'setfarewellmessage <message>',
      description: oneLine`
      Définit le message que Nira dira lorsque quelqu'un quitte votre serveur.`,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setfarewellmessage ?member has left the server.']
    });
  }
  run(message, args) {

    const { farewell_channel_id: farewellChannelId, farewell_message: oldFarewellMessage } = 
      message.client.db.settings.selectFarewells.get(message.guild.id);
    const farewellChannel = message.guild.channels.cache.get(farewellChannelId);
    
    // Get status
    const oldStatus = message.client.utils.getStatus(farewellChannelId, oldFarewellMessage);

    const embed = new MessageEmbed()
      .setTitle('Paramètre: `Goodbye`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`message Goodbye\` a été mis à jour avec succès . ${emojis.success}`)
      .addField('Channel', farewellChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateFarewellMessage.run(null, message.guild.id);

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send(embed
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      );
    }
    
    let farewellMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateFarewellMessage.run(farewellMessage, message.guild.id);
    if (farewellMessage.length > 1024) farewellMessage = farewellMessage.slice(0, 1021) + '...';

    // Update status
    const status =  message.client.utils.getStatus(farewellChannel, farewellMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;
    
    message.channel.send(embed
      .addField('Status', statusUpdate, true)
      .addField('Message', message.client.utils.replaceKeywords(farewellMessage))
    );
  }
};