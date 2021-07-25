const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');

module.exports = class SetPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setprefix',
      aliases: ['setp', 'sp'],
      usage: 'setprefix <prefix>',
      description: 'Définit la commande `prefix` pour votre serveur. La longueur maximale du `préfixe` est de 3 caractères. ',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setprefix !']
    });
  }
  run(message, args) {
    const oldPrefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const prefix = args[0];
    if (!prefix) return this.sendErrorMessage(message, 0, 'Please provide a prefix');
    else if (prefix.length > 3) 
      return this.sendErrorMessage(message, 0, 'Please ensure the prefix is no larger than 3 characters');
    message.client.db.settings.updatePrefix.run(prefix, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`préfixe\` a été mis à jour avec succèsd. ${emojis.success}`)
      .addField('Prefix', `\`${oldPrefix}\` ➔ \`${prefix}\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
