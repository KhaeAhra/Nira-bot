const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');

module.exports = class SetCommandPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcommandpoints',
      aliases: ['setcp', 'scp'],
      usage: 'setcommandpoints <point count>',
      description: 'Définit le nombre de points gagnés par commande Nira utilisée. ',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcommandpoints 5']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 0, 'Veuillez saisir un nombre entier positif ');
    const { 
      point_tracking: pointTracking, 
      message_points: messagePoints, 
      command_points: commandPoints,
      voice_points: voicePoints 
    } = message.client.db.settings.selectPoints.get(message.guild.id);
    const status = message.client.utils.getStatus(pointTracking);
    message.client.db.settings.updateCommandPoints.run(amount, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Paramètre: `Points`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`La valeur des \`points de commande\` a été mise à jour avec succès. ${emojis.success}`)
      .addField('Messages Points', `\`${messagePoints}\``, true)
      .addField('Commandes Points', `\`${commandPoints}\` ➔ \`${amount}\``, true)
      .addField('Voice Points', `\`${voicePoints}\``, true)
      .addField('Status', `\`${status}\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
