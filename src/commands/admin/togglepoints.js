const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');

module.exports = class TogglePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglepoints',
      aliases: ['togglep', 'togp'],
      usage: 'togglepoints',
      description: 'Active ou désactive les point-tracker de Nira. ',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    let { 
      point_tracking: pointTracking, 
      message_points: messagePoints, 
      command_points: commandPoints,
      voice_points: voicePoints 
    } = message.client.db.settings.selectPoints.get(message.guild.id);
    pointTracking = 1 - pointTracking; // Invert
    message.client.db.settings.updatePointTracking.run(pointTracking, message.guild.id);

    let description, status;
    if (pointTracking == 1) {
      status = '`désactivés`	🡪 `activés`';
      description = `\`Points\` ont été **activés** avec succès . ${emojis.success}`;
    } else {
      status = '`activés` 🡪 `désactivés`';
      description = `\`Points\` ont été **désactivés** avec succès. ${fail}`;   
    } 
    
    const embed = new MessageEmbed()
      .setTitle('Settings: `Points`')
      .setThumbnail(message.guild.iconURL())
      .setDescription(description)
      .addField('Message Points', `\`${messagePoints}\``, true)
      .addField('Command Points', `\`${commandPoints}\``, true)
      .addField('Voice Points', `\`${voicePoints}\``, true)
      .addField('Status', status)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};