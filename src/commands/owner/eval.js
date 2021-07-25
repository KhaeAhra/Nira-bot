const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      usage: 'eval <code>',
      description: 'calcule',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['eval 1 + 1']
    });
  }
  run(message, args) {
    const input = args.join(' ');
    if (!input) return this.sendErrorMessage(message, 0, 'Veuillez fournir le code à eval');
    if(!input.toLowerCase().includes('token')) {

      const embed = new MessageEmbed();

      try {
        let output = eval(input);
        if (typeof output !== 'string') output = require('util').inspect(output, { depth: 0 });
        
        embed
          .addField('Entrée', `\`\`\`js\n${input.length > 1024 ? 'Trop grand pour être affiché. ' : input}\`\`\``)
          .addField('Sortie', `\`\`\`js\n${output.length > 1024 ? 'Trop grand pour être affiché. ' : output}\`\`\``)
          .setColor('#66FF00');

      } catch(err) {
        embed
          .addField('Entrée', `\`\`\`js\n${input.length > 1024 ? 'Trop grand pour être affiché. ' : input}\`\`\``)
          .addField('Sortie', `\`\`\`js\n${err.length > 1024 ? 'Trop grand pour être affiché. ' : err}\`\`\``)
          .setColor('#FF0000');
      }

      message.channel.send(embed);

    } else {
      message.channel.send('(╯°□°)╯︵ ┻━┻ MY token. **MINE**.');
    }
  }
};