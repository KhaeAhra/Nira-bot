const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class ToggleCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglecommand',
      aliases: ['togglec', 'togc', 'tc'],
      usage: 'togglecommand <command>',
      description: oneLine`
      Active ou désactive la commande fournie.
      Les commandes désactivées ne pourront plus être utilisées et ne s'afficheront plus avec la commande \`help\`. 
        \`${client.utils.capitalize(client.types.ADMIN)}\` commands cannot be disabled.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['togglecommand ping']
    });
  }
  run(message, args) {

    const { ADMIN, OWNER } = message.client.types;

    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (!command || (command && command.type == OWNER)) 
      return this.sendErrorMessage(message, 0, 'Veuillez fournir une commande valide ');

    const { capitalize } = message.client.utils;

    if (command.type === ADMIN) 
      return this.sendErrorMessage(message, 0, `${capitalize(ADMIN)} les commandes ne peuvent pas être désactivées`);

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    let description;

    // Disable command
    if (!disabledCommands.includes(command.name)) {
      disabledCommands.push(command.name); // Add to array if not present
      description = `The \`${command.name}\` la commande a été **désactivée** avec succès. ${emojis.fail}`;
    
    // Enable command
    } else {
      message.client.utils.removeElement(disabledCommands, command.name);
      description = `The \`${command.name}\` la commande a été **activée** avec succès. ${emojis.success}`;
    }

    message.client.db.settings.updateDisabledCommands.run(disabledCommands.join(' '), message.guild.id);

    disabledCommands = disabledCommands.map(c => `\`${c}\``).join(' ') || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField('Disabled Commands', disabledCommands, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
