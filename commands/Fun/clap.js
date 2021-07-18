const Discord = require('discord.js');
const clap = require('../../data/clap.json');

module.exports = {
	name: 'clap',
	aliases: ['cl'],
	category: 'Fun',
	utilisation: '{prefix}clap <command name>',

	// eslint-disable-next-line no-unused-vars
	execute(client, message, args) {
		
		const applau = clap [Math.floor((Math.random() * clap.length))];
		const member = message.mentions.members.first();
		if(!member) {

			const embed = new Discord.MessageEmbed()
				.setDescription(`${message.author} applaudi ! :clap:`)
				.setColor(client.config.discord.color)
				.setImage (applau);
			message.channel.send(embed);
			message.delete();
			return;
		}

		const embed = new Discord.MessageEmbed()
			.setDescription(`${member}, ${message.author} vous applaudi ! :clap:`)
			.setColor(client.config.discord.color)
			.setImage (applau);
		message.channel.send(embed);
		message.delete();
		return;

	} };