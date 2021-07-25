const { MessageEmbed } = require('discord.js');
const emojis = require('../../dataJson/emojis.json');

module.exports = (client, guild) => {

  client.logger.info(`Nira rejoins ${guild.name}`);
  const serverLog = client.channels.cache.get(client.serverLogId);
  if (serverLog)
    serverLog.send(new MessageEmbed().setDescription(`${client.user} quitte **${guild.name}** ${emojis.fail}`));

  client.db.settings.deleteGuild.run(guild.id);
  client.db.users.deleteGuild.run(guild.id);

  if (guild.job) guild.job.cancel(); 

};
