const Command = require('../Command.js');
const { MessageEmbed, MessageCollector } = require('discord.js');
const fs = require('fs');
const YAML = require('yaml');
const { oneLine } = require('common-tags');

module.exports = class TriviaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trivia',
      aliases: ['triv', 't'],
      usage: 'trivia [topic]',
      description: oneLine`
      Affrontez vos amis dans un jeu-questionnaire (tout le monde peut répondre).
      Si aucun thème n'est donné, un thème aléatoire sera choisi.
      La question expirera après 15 secondes. 
      `,
      type: client.types.FUN,
      examples: ['trivia sports']
    });
  }
  run(message, args) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    let topic = args[0];
    if (!topic) { // Pick a random topic if none given
      topic = message.client.topics[Math.floor(Math.random() * message.client.topics.length)];
    } else if (!message.client.topics.includes(topic))
      return this.sendErrorMessage(message, 0, `Veuillez fournir un sujet valide, utilisez ${prefix}topics pour une list`);
    
    // Get question and answers
    const path = __basedir + '/data/trivia/' + topic + '.yml';
    const questions = YAML.parse(fs.readFileSync(path, 'utf-8')).questions;
    const n = Math.floor(Math.random() * questions.length);
    const question = questions[n].question;
    const answers = questions[n].answers;
    const origAnswers = [...answers].map(a => `\`${a}\``);
    // Clean answers
    for (let i = 0; i < answers.length; i++) {
      answers[i] = answers[i].trim().toLowerCase().replace(/\.|'|-|\s/g, '');
    }

    // Get user answer
    const questionEmbed = new MessageEmbed()
      .setTitle('Trivia')
      .addField('Topic', `\`${topic}\``)
      .addField('Question', `${question}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    const url = question.match(/\bhttps?:\/\/\S+/gi);
    if (url) questionEmbed.setImage(url[0]);
    message.channel.send(questionEmbed);
    let winner;
    const collector = new MessageCollector(message.channel, msg => {
      if (!msg.author.bot) return true;
    }, { time: 15000 }); // Wait 15 seconds
    collector.on('collect', msg => {
      if (answers.includes(msg.content.trim().toLowerCase().replace(/\.|'|-|\s/g, ''))) {
        winner = msg.author;
        collector.stop();
      }
    });
    collector.on('end', () => {
      const answerEmbed = new MessageEmbed()
        .setTitle('Trivia')
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      if (winner) 
        message.channel.send(answerEmbed.setDescription(`Félicitations ${emojis.winner}, vous avez donné la bonne réponse ! `));
      else message.channel.send(answerEmbed
        .setDescription('Désolé, le temps est écoulé ! Plus de chance la prochaine fois. ')
        .addField('Réponses correctes', origAnswers.join('\n'))
      );
    });
  }
};
