const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class PrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      aliases: ['pre'],
      usage: 'prefix',
      description: 'Récupère le préfixe actuel de Calypso.',
      type: client.types.INFO
    });
  }
  run(message) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const embed = new MessageEmbed()
      .setTitle('Calypso\'s Prefix')
      .setThumbnail('https://i.imgur.com/kCoME8W.png')
      .addField('Prefix', `\`${prefix}\``, true)
      .addField('Exemple', `\`${prefix}ping\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
