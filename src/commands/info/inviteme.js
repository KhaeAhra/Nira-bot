const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class InviteMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'inviteme',
      aliases: ['invite', 'invme', 'im'],
      usage: 'inviteme',
      description: 'Génère un lien que vous pouvez utiliser pour inviter Nira sur votre propre serveur .',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle('Invite Me')
      .setThumbnail('https://i.imgur.com/kCoME8W.png')
      .setDescription(oneLine`
        Clique [ici](https://discord.com/api/oauth2/authorize?client_id=860511373711638539&permissions=8&scope=bot)
        pour m'inviter sur votre serveur ! 
      `)
      .addField()
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
