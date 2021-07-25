const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class ExplainPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'explainpoints',
      aliases: ['explainp', 'ep', 'howtopoints', 'h2points'],
      usage: 'explainpoints',
      description: 'Explique les différents aspects des points et des systèmes de couronne de Nira.',
      type: client.types.POINTS
    });
  }
  run(message) {

    // Get disabled leaderboard
    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const { message_points: messagePoints, command_points: commandPoints, voice_points: voicePoints } 
      = message.client.db.settings.selectPoints.get(message.guild.id);

    // Points per
    let earningPoints = 
      stripIndent`Vous pouvez gagner des points des manières suivantes : en envoyant des **messages**, en utilisant des **commandes**,` +
      ' et en passant du temps en **chat vocal**.';
    if (!disabledCommands.includes('givepoints')) earningPoints += 
      ` Et si quelqu'un se sent généreux, il peut vous donner des points en utilisant la commande \`${prefix}givepoints\`.`;
    
    const pointsPer = stripIndent`
      Message Points :: ${messagePoints} par message
      Command Points :: ${commandPoints} par commande
      Voice Points   :: ${voicePoints} par minute
    `;

    earningPoints += ` Voici les **points par action** de ce serveur :\n\`\`\`asciidoc\n${pointsPer}\`\`\``;
 
    if (!disabledCommands.includes('pointsper'))
      earningPoints += `
      Pour revoir rapidement les points par action de votre serveur, vous pouvez utiliser la commande \`${prefix}pointsper\`.
      `;

    // Checking points
    let checkingPoints = '';

    if (!disabledCommands.includes('points'))
      checkingPoints += `\nPour voir les points actuels, utilisez la commande \`${prefix}points\`.`;
    
    if (!disabledCommands.includes('totalpoints'))
      checkingPoints += ` Pour voir les points globaux, utilisez la commande \`${prefix}totalpoints\`.`;

    // The Leaderboard
    let leaderboard = '';

    if (!disabledCommands.includes('position'))
      leaderboard += ` Pour vérifier le classement, utilisez la commande \`${prefix}position\`.`;
      
    if (!disabledCommands.includes('leaderboard'))
      leaderboard += ` Pour voir le classement lui-même, utilisez la commande \`${prefix}leaderboard\`.`;
    
    // The Crown
    let crown = stripIndent`
    Si un \`rôle de couronne\` et un \`programme de couronne\` sont définis, alors la personne avec le plus de points de ce cycle gagnera !` +
      ` De plus, les points de chacun seront réinitialisés à **0** (le total des points restera inchangé).
    `;

    if (!disabledCommands.includes('crown'))
      crown += `\nUtilisez la commande \`${prefix}crown\` pour obtenir des informations spécifiques au serveur.`;

    const embed = new MessageEmbed()
      .setTitle('Points and Crown')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Gagner des points', earningPoints)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (checkingPoints) embed.addField('Checking Points', checkingPoints);
    if (leaderboard) embed.addField('Leaderboard', leaderboard);
    embed.addField('Crown', crown);
    message.channel.send(embed);
  }
};
