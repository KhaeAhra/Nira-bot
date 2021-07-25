const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AddRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addrole',
      aliases: ['giverole', 'addr', 'ar'],
      usage: 'addrole <user mention/ID> <role mention/ID> [reason]',
      description: `Ajoute le rôle spécifié à l'utilisateur fourni`,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['addrole @Nettles @Member']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID valide');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, `Vous ne pouvez pas ajouter un rôle à quelqu'un avec un rôle égal ou supérieur`);

    const role = this.getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1]);
    
    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (!role)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un rôle ou fournir un ID de rôle valide');
    else if (member.roles.cache.has(role.id)) // If member already has role
      return this.sendErrorMessage(message, 0, `L'utilisateur a déjà le rôle fourni`);
    else {
      try {

        // Add role
        await member.roles.add(role);
        const embed = new MessageEmbed()
          .setTitle('Add Role')
          .setDescription(`${role} was successfully added to ${member}.`)
          .addField('Modor', message.member, true)
          .addField('Membre', member, true)
          .addField('Rôle', role, true)
          .addField('Raison', reason)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);

        // Update mod log
        this.sendModLogMessage(message, reason, { Member: member, Role: role });

      } catch (err) {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôle', err.message);
      }
    }  
  }
};