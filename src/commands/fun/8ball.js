const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const answers = [
   'Il est certain.',
   `C'est décidément ainsi.`,
   'Sans aucun doute.',
   'Oui définitivement.',
   'Vous pouvez vous y fier.',
   'Comme je le vois oui.',
   'Le plus probable.',
   'De bonnes perspectives.',
   'Oui.',
   'Les signes pointent vers Oui.',
   'Répondez brumeux, réessayez.',
   'Demander à nouveau plus tard.',
   'Mieux vaut ne pas vous le dire maintenant.',
   'Impossible de prédire maintenant.',
   'Concentrez-vous et demandez à nouveau.',
   'Ne comptez pas dessus.',
   'Ma réponse est non.',
   'Mes sources disent non.',
   'Les perspectives ne sont pas si bonnes.',
   'Très douteux.'
];

module.exports = class EightBallCommand extends Command {
  constructor(client) {
    super(client, {
      name: '8ball',
      aliases: ['fortune'],
      usage: '8ball <question>',
      description: 'Demande au Magic 8-Ball un peu de sagesse psychique.',
      type: client.types.FUN,
      examples: ['8ball Am I going to win the lottery?']
    });
  }
  run(message, args) {
    const question = args.join(' ');
    if (!question) return this.sendErrorMessage(message, 0, 'Please provide a question to ask');
    const embed = new MessageEmbed()
      .setTitle('🎱  The Magic 8-Ball  🎱')
      .addField('Question', question)
      .addField('Answer', `${answers[Math.floor(Math.random() * answers.length)]}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
