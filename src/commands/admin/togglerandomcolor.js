const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');

module.exports = class ToggleRandomColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglerandomcolor',
      aliases: ['togglerc', 'togrc', 'trc'],
      usage: 'togglerandomcolor',
      description: 'Active ou désactive l attribution aléatoire de rôles de couleur lorsqu une personne rejoint votre serveur',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    let randomColor = message.client.db.settings.selectRandomColor.pluck().get(message.guild.id);
    randomColor = 1 - randomColor; // Invert
    message.client.db.settings.updateRandomColor.run(randomColor, message.guild.id);
    let description, status;
    if (randomColor == 1) {
      status = '`désactivé`	🡪 `activé`';
      description = `\`Random color\` a été **activé** avec succès. ${emojis.success}`;
    } else {
      status = '`activé` 🡪 `désactivé`';
      description = `\`Random color\` a été **désactivé** avec succès . ${emojis.fail}`;   
    } 
    
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL())
      .setDescription(description)
      .addField('Random Color', status, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};