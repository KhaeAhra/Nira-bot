const Discord = require('discord.js');

module.exports = {
	name: '8ball',
	aliases: ['8'],
	category: 'Fun',
	utilisation: '{prefix}8ball <command name>',

	execute(client, message, args) {
		
		if(!args[1]) return message.reply('S\'il vous plaît entrez une question complète avec 2 mots ou plus!');
		const replies = require('../../data/reponse.json');

		const result = Math.floor((Math.random() * replies.length));
		const question = args.join(' ');

		const ballembed = new Discord.MessageEmbed()
			.setColor(client.config.discord.color)
			.setDescription(':8ball:| 8ball')
			.setThumbnail(client.config.discord.nira)
			.addField('Question', question)
			.addField('Réponse', replies[result])
			.setFooter(`Demande par: ${message.author.tag}`, message.author.avatarURL());
		message.channel.send(ballembed);
		message.delete();

	} };