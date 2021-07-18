module.exports = {
	name: 'ping',
	aliases: [],
	category: 'Owner',
	utilisation: '{prefix}ping',

	execute(client, message) {
		if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply(':no_entry:  Tu n\'as pas la permission d\'utiliser cette commande.');
		message.delete();
		message.channel.send(`${client.emotes.success} - Pong : **${client.ws.ping}ms** !`).then(msg => msg.delete({ timeout: 10000 }));
	},
};