const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class LeaderboardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      aliases: ['top', 'lb', 'rankings'],
      usage: 'leaderboard [member count]',
      description: oneLine`
      Affiche le classement des points de serveur du nombre de membres fourni.
      Si aucun nombre de membres n'est indiqué, le classement sera par défaut de taille 10.
      La taille maximale du classement est de 25.
      `,
      type: client.types.POINTS,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
      examples: ['leaderboard 20']
    });
  }
  async run(message, args) {
    let max = parseInt(args[0]);
    if (!max || max < 0) max = 10;
    else if (max > 25) max = 25;
    let leaderboard = message.client.db.users.selectLeaderboard.all(message.guild.id);
    const position = leaderboard.map(row => row.user_id).indexOf(message.author.id);

    const members = [];
    let count = 1;
    for (const row of leaderboard) {
      members.push(oneLine`
        **${count}.** ${await message.guild.members.cache.get(row.user_id)} - \`${row.points}\` points
      `);
      count++;
    }

    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(
        `${message.member.displayName}'s position: ${position + 1}`,  
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    

    if (members.length <= max) {
      const range = (members.length == 1) ? '[1]' : `[1 - ${members.length}]`;
      message.channel.send(embed
        .setTitle(`Points Leaderboard ${range}`)
        .setDescription(members.join('\n'))
      );

    // Reaction Menu
    } else {

      embed
        .setTitle('Points Leaderboard')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expire après deux minutes.\n' + `${message.member.displayName} position: ${position + 1}`,  
          message.author.displayAvatarURL({ dynamic: true })
        );
      
      new ReactionMenu(message.client, message.channel, message.member, embed, members, max);

    } 
  }
};
