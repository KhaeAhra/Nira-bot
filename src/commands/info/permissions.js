const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const permissions = require('../../../dataJson/permissions.json');
const { oneLine } = require('common-tags');

module.exports = class PermissionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'permissions',
      aliases: ['perms'],
      usage: 'permissions [user mention/ID]',
      description: oneLine`
      Affiche toutes les autorisations actuelles pour l'utilisateur spécifié.
      Si aucun utilisateur n'est donné, vos propres autorisations seront affichées.
      `,
      type: client.types.INFO,
      examples: ['permissions @Nettles']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;

    // Get member permissions
    const memberPermissions = member.permissions.toArray();
    const finalPermissions = [];
    for (const permission in permissions) {
      if (memberPermissions.includes(permission)) finalPermissions.push(`+ ${permissions[permission]}`);
      else finalPermissions.push(`- ${permissions[permission]}`);
    }

    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s Permissions`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(member.displayHexColor);
    message.channel.send(embed);
  }
};