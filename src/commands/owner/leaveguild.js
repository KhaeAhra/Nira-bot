const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class LeaveGuildCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leaveguild',
      usage: 'leaveguild <server ID>',
      description: 'Force Nira à quitter le serveur spécifié.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['leaveguild 709992782252474429']
    });
  }
  async run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId))
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un identifiant de serveur valide');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 0, `Impossible de trouver le serveur, veuillez vérifier l'ID fourni`);
    await guild.leave();
    const embed = new MessageEmbed()
      .setTitle('Serveurs quitté')
      .setDescription(`J'ai réussi à quitter **${guild.name}**.`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  } 
};
