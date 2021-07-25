const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const pkg = require(__basedir + '/package.json');
const emojis = require('../../../dataJson/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['bot', 'bi'],
      usage: 'botinfo',
      description: 'Récupère les informations du bot de Nira.',
      type: client.types.INFO
    });
  }
  run(message) {
    const botOwner = message.client.users.cache.get(message.client.ownerId);
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const tech = stripIndent`
      Version     :: ${pkg.version}
      Library     :: Discord.js v12.5.3
      Environment :: Node.js v16.4.0
      Database    :: SQLite
    `;
    const embed = new MessageEmbed()
      .setTitle('Informations sur Nira')
      .setDescription(oneLine`
      Nira est un bot Discord open source et entièrement personnalisable basé sur Calypso bot.
      pour un usage privé a but d'apprentissage en code Node.js, Discord.js`)
      .addField('Prefix', `\`${prefix}\``, true)
      .addField('Client ID', `\`${message.client.user.id}\``, true)
      .addField(`Developer ${emojis.owner}`, botOwner, true)
      .addField('Tech', `\`\`\`asciidoc\n${tech}\`\`\``)
      .addField(
        'Links', 
        '**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=860511373711638539&permissions=8&scope=bot) | ' +
        '[Repository](https://github.com/KhaeAhra/Nira-bot)**'
      )
      .setImage('https://i.imgur.com/kCoME8W.png')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
