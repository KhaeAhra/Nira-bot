module.exports = {
    name: 'verifchannel',
    aliases: ['VF'],
    category: 'Owner',
    utilisation: '{prefix}verifchannel',

    execute(client, message) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":no_entry:  Tu n'as pas la permission d'utiliser cette commande.");
        message.channel.send(`${client.emotes.success} - ${client.user.username} connecté à **${client.voice.connections.size}** channels !`);
    },
};