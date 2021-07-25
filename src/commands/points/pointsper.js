const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class PointPerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pointsper',
      aliases: ['pointsp', 'pp'],
      usage: '',
      description: 'Affiche le nombre de points gagnés par action.',
      type: client.types.POINTS
    });
  }
  run(message) {
    
    // Get points values
    const { message_points: messagePoints, command_points: commandPoints, voice_points: voicePoints } 
      = message.client.db.settings.selectPoints.get(message.guild.id);
    const pointsPer = stripIndent`
      Message Points :: ${messagePoints} par message
      Command Points :: ${commandPoints} par commande
      Voice Points   :: ${voicePoints} par minute
    `;

    const embed = new MessageEmbed()
      .setTitle('Points Par Action')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`\`\`\`asciidoc\n${pointsPer}\`\`\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};