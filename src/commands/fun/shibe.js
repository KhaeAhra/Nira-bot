const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class ShibeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shibe',
      usage: 'shibe',
      description: 'Trouve un shibe aléatoire pour votre plaisir.',
      type: client.types.FUN
    });
  }
  async run(message) {
    try {
      const res = await fetch('http://shibe.online/api/shibes');
      const img = (await res.json())[0];
      const embed = new MessageEmbed()
        .setTitle('🐶  Shibe!  🐶')
        .setImage(img)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, 'Veuillez réessayer dans quelques seconde', err.message);
    }
  }
};
