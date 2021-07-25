const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['clear'],
      usage: 'purge [channel mention/ID] [user mention/ID] <message count> [reason]',
      description: oneLine`
      Supprime le nombre spécifié de messages du canal fourni.
      Si aucun canal n'est indiqué, les messages seront supprimés du canal actuel.
      Si un membre est fourni, seuls ses messages seront supprimés du lot.
      Pas plus de 100 messages peuvent être supprimés à la fois.
      Les messages de plus de 2 semaines ne peuvent pas être supprimés.
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['purge 20', 'purge #general 10', 'purge @Nettles 50', 'purge #general @Nettles 5']
    });
  }
  async run(message, args) {

    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    // Check type and viewable
    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
    Veuillez mentionner une chaîne de texte accessible ou fournir un identifiant de chaîne de texte valide 
    `);

    let member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (member) {
      args.shift();
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un nombre de messages compris entre 1 et 100');

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_MESSAGES']))
      return this.sendErrorMessage(message, 0, `Je n'ai pas la permission de gérer les messages dans le canal fourni`);

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.delete(); // Delete command message

    // Find member messages if given
    let messages;
    if (member) {
      messages = (await channel.messages.fetch({ limit: amount })).filter(m => m.member.id === member.id);
    } else messages = amount;

    if (messages.size === 0) { // No messages found

      message.channel.send(
        new MessageEmbed()
          .setTitle('Purge')
          .setDescription(`
          Impossible de trouver les messages de ${member}.
          Ce message sera supprimé après \`10 secondes\`.
          `)
          .addField('Channel', channel, true)
          .addField('Membre', member )
          .addField('Nombres de messages éffacés', `\`${messages.size}\``, true)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor)
      ).then(msg => msg.delete({ timeout: 10000 })).catch(err => message.client.logger.error(err.stack));

    } else { // Purge messages

      channel.bulkDelete(messages, true).then(messages => {
        const embed = new MessageEmbed()
          .setTitle('Purge')
          .setDescription(`
          **${messages.size}** messages supprimés avec succès.
           Ce message sera supprimé après \`10 secondes\`
          `)
          .addField('Channel', channel, true)
          .addField('Nombres de massages éffacés', `\`${messages.size}\``, true)
          .addField('Raison', reason)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
  
        if (member) {
          embed
            .spliceFields(1, 1, { name: 'Found Messages', value:  `\`${messages.size}\``, inline: true})
            .spliceFields(1, 0, { name: 'Member', value: member, inline: true});
        }

        message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
          .catch(err => message.client.logger.error(err.stack));
      });
    }
    
    // Update mod log
    const fields = { 
      Channel: channel
    };

    if (member) {
      fields['Member'] = member;
      fields['Found Messages'] = `\`${messages.size}\``;
    } else fields['Message Count'] = `\`${amount}\``;

    this.sendModLogMessage(message, reason, fields);

  }
};
