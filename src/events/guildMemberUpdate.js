const { MessageEmbed } = require('discord.js');

module.exports = (client, oldMember, newMember) => {
  
  const embed = new MessageEmbed()
    .setAuthor(`${newMember.user.tag}`, newMember.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(oldMember.guild.me.displayHexColor);

  // Nickname change
  if (oldMember.nickname != newMember.nickname) {
    // Get nickname log
    const nicknameLogId = client.db.settings.selectNicknameLogId.pluck().get(oldMember.guild.id);
    const nicknameLog = oldMember.guild.channels.cache.get(nicknameLogId);
    if (
      nicknameLog &&
      nicknameLog.viewable &&
      nicknameLog.permissionsFor(oldMember.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const oldNickname = oldMember.nickname || '`None`';
      const newNickname = newMember.nickname || '`None`';
      embed
        .setTitle('Mise à jour des membres : "Pseudo"')
        .setDescription(`Le **surnom** de ${newMember} a été modifié.`)
        .addField('Nickname', `${oldNickname} ➔ ${newNickname}`);
      nicknameLog.send(embed);
    }
  }

  // Role add
  if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    // Get role log
    const roleLogId = client.db.settings.selectRoleLogId.pluck().get(oldMember.guild.id);
    const roleLog = oldMember.guild.channels.cache.get(roleLogId);
    if (
      roleLog &&
      roleLog.viewable &&
      roleLog.permissionsFor(oldMember.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const role = newMember.roles.cache.difference(oldMember.roles.cache).first();
      embed
        .setTitle('Member Update: `Role Add`')
        .setDescription(`${newMember} s'est **attribué** le rôle ${role}.`);
      roleLog.send(embed);
    }
  }

  // Role remove
  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    // Get role log
    const roleLogId = client.db.settings.selectRoleLogId.pluck().get(oldMember.guild.id);
    const roleLog = oldMember.guild.channels.cache.get(roleLogId);
    if (
      roleLog &&
      roleLog.viewable &&
      roleLog.permissionsFor(oldMember.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const role = oldMember.roles.cache.difference(newMember.roles.cache).first();
      embed
        .setTitle('Member Update: `Role Remove`')
        .setDescription(`${newMember} was **removed** from ${role} role.`);
      roleLog.send(embed);
    }
  }
};
