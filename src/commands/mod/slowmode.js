const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SlowmodeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'slowmode',
      aliases: ['slow', 'sm'],
      usage: 'slowmode [channel mention/ID] <rate> [reason]',
      description: oneLine`
      Active le mode lent dans un canal avec le débit spécifié.
      Si aucun canal n'est fourni, le mode lent affectera le canal actuel.
      Fournissez un taux de 0 pour désactiver
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
      examples: ['slowmode #general 2', 'slowmode 3']
    });
  }
  async run(message, args) {
    let index = 1;
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel) {
      channel = message.channel;
      index--;
    }

    // Check type and viewable
    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
    Veuillez mentionner une chaîne de texte accessible ou fournir un identifiant de chaîne de texte valide
    `);
      
    const rate = args[index];
    if (!rate || rate < 0 || rate > 59) return this.sendErrorMessage(message, 0, stripIndent`
    Veuillez fournir une limite de débit entre 0 et 59 secondes
    `);

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_CHANNELS']))
      return this.sendErrorMessage(message, 0, `Je n'ai pas l'autorisation de gérer la chaîne fournie`);

    let reason = args.slice(index + 1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    await channel.setRateLimitPerUser(rate, reason); // set channel rate
    const status = (channel.rateLimitPerUser) ? 'enabled' : 'disabled';
    const embed = new MessageEmbed()
      .setTitle('Slowmode')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Slowmode disabled
    if (rate === '0') {
      message.channel.send(embed
        .setDescription(`\`${status}\` ➔ \`disabled\``)
        .addField('Modo', message.member, true)
        .addField('Channel', channel, true)
        .addField('Raison', reason)
      );
    
      // Slowmode enabled
    } else {

      message.channel.send(embed
        .setDescription(`\`${status}\` ➔ \`enabled\``)
        .addField('Modo', message.member, true)
        .addField('Channel', channel, true)
        .addField('Rate', `\`${rate}\``, true)
        .addField('Raison', reason)
      );
    }

    // Update mod log
    this.sendModLogMessage(message, reason, { Channel: channel, Rate: `\`${rate}\`` });
  }
};
