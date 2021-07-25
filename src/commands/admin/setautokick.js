const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetAutoKickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setautokick',
      aliases: ['setak', 'sak'],
      usage: 'setautokick <warn count>',
      description: oneLine`
       Définit le nombre d'avertissements nécessaires avant un Auto-Kick, O pour désactiver.`,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setautokick 3']
    });
  }
  run(message, args) {

    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id) || 'disabled';
    const amount = args[0];
    if (amount && (!Number.isInteger(Number(amount)) || amount < 0)) 
      return this.sendErrorMessage(message, 0, 'Veuillez saisir un nombre entier positif ');
      
    const embed = new MessageEmbed()
      .setTitle('Paramètre: `Systeme`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`\`Auto kick\` a été mis à jour avec succès. ${emojis.success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0 || amount == 0) {
      message.client.db.settings.updateAutoKick.run(null, message.guild.id);
      return message.channel.send(embed.addField('Auto Kick', `\`${autoKick}\` ➔ \`disabled\``));
    }

    message.client.db.settings.updateAutoKick.run(amount, message.guild.id);
    message.channel.send(embed.addField('Auto Kick', `\`${autoKick}\` ➔ \`${amount}\``));
  }
};
