const { MessageEmbed } = require('discord.js');

module.exports = (client, message) => {
  
  if (message.webhookID || (!message.content && message.embeds.length === 0)) return;
  
  const embed = new MessageEmbed()
    .setTitle('Mise à jour du message : Supprimer')
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(message.guild.me.displayHexColor);
  
  if (message.content) {

    const starboardChannelId = client.db.settings.selectStarboardChannelId.pluck().get(message.guild.id);
    const starboardChannel = message.guild.channels.cache.get(starboardChannelId);
    if (message.channel == starboardChannel) return;

    const messageDeleteLogId = client.db.settings.selectMessageDeleteLogId.pluck().get(message.guild.id);
    const messageDeleteLog = message.guild.channels.cache.get(messageDeleteLogId);
    if (
      messageDeleteLog &&
      messageDeleteLog.viewable &&
      messageDeleteLog.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {

      if (message.content.length > 1024) message.content = message.content.slice(0, 1021) + '...';

      embed
        .setDescription(`Le **message** de ${message.member} dans ${message.channel} a été supprimé.`)
        .addField('Message', message.content);
        
      messageDeleteLog.send(embed);
    }

  } else { 

    // Get message delete log
    const messageDeleteLogId = client.db.settings.selectMessageDeleteLogId.pluck().get(message.guild.id);
    const messageDeleteLog = message.guild.channels.cache.get(messageDeleteLogId);
    if (
      messageDeleteLog &&
      messageDeleteLog.viewable &&
      messageDeleteLog.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {

      embed
        .setTitle('Message Update: `Delete`')
        .setDescription(`Le **message intégré** de ${message.member} dans ${message.channel} a été supprimé.`);
      messageDeleteLog.send(embed);
    }
  }
  
};