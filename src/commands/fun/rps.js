const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const rps = ['scissors','rock', 'paper'];
const res = ['Scissors :v:','Rock :fist:', 'Paper :raised_hand:'];

module.exports = class RockPaperScissorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rps',
      usage: 'rps <rock | paper | scissors>',
      description: 'Faites une partie de pierre-papier-ciseaux contre Nira ! ',
      type: client.types.FUN,
      examples: ['rps rock']
    });
  }
  run(message, args) {
    let userChoice;
    if (args.length) userChoice = args[0].toLowerCase();
    if (!rps.includes(userChoice)) 
      return this.sendErrorMessage(message, 0, 'Veuillez saisir pierre(rock), papier(paper) ou ciseaux(scissors)');
    userChoice = rps.indexOf(userChoice);
    const botChoice = Math.floor(Math.random()*3);
    let result;
    if (userChoice === botChoice) result = 'It\'s a draw!';
    else if (botChoice > userChoice || botChoice === 0 && userChoice === 2) result = '**Nira** Gagne!';
    else result = `**${message.member.displayName}** Gagne!`;
    const embed = new MessageEmbed()
      .setTitle(`${message.member.displayName} vs. Nira`)
      .addField('Vous:', res[userChoice], true)
      .addField('Nira:', res[botChoice], true)
      .addField('Résultats', result, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
