const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class RemoveRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'removerole',
      aliases: ['remover', 'rr'],
      usage: 'removerole <user mention/ID> <role mention/ID> [reason]',
      description: `Supprime le rôle spécifié de l'utilisateur fourni.`,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['removerole @Nettles @Member']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, `Veuillez mentionner un utilisateur ou fournir un identifiant d'utilisateur valide`);
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, `Vous ne pouvez pas supprimer un rôle de quelqu'un avec un rôle égal ou supérieur`);

    const role = this.getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1]);

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    if (!role) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un rôle ou fournir un ID de rôle valide');
    else if (!member.roles.cache.has(role.id)) // If member doesn't have role
      return this.sendErrorMessage(message, 0, `L'utilisateur n'a pas le rôle fourni`);
    else {
      try {

        // Add role
        await member.roles.remove(role);
        const embed = new MessageEmbed()
          .setTitle('Remove Role')
          .setDescription(`${role} was successfully removed from ${member}.`)
          .addField('Modo', message.member, true)
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
        this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
      }
    }  
  }
};