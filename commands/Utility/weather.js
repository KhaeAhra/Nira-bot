const Discord = require('discord.js');
const weather = require('weather-js');

module.exports = {
	name: 'weather',
	aliases: ['w'],
	category: 'Utility',
	utilisation: '{prefix}weather <command name>',

	execute(client, message, args) {

		let embed, search;
		search = args.join(' ');
		if(!search) return message.channel.send(' Ajoute une ville à la commande ');

		weather.find({ search:search, degreeType: 'C' }, function(err, result) {
			if(err) console.log(err);
			if(!result[0]) return message.channel.send(' Ville introuvable :scream: ');
			const current = result[0].current;
			const location = result[0].location;
			const results = result[0];
			const temps = (client.translate.meteo);
			const jours = (client.translate.days);
			// const cardinal = (client.translate.cardinal);

			const embed = new Discord.MessageEmbed()
			.setAuthor(` Météo pour ${current.observationpoint}`)
            .setDescription(`Voici les prévisions ${message.author}`)  //+ message.author.username)
            .setTimestamp() 
            .setThumbnail(current.imageUrl)
            .setColor(client.config.discord.color)
            .addField(":calendar_spiral:| Date", current.date, true)
            .addField(":date:| Jour", jours[current.day], true)
            .addField(`:round_pushpin: | Météo actuelle`, temps[current.skytext], true)
            .addField(":thermometer:| Température", `${current.temperature + "°C"}`, true)
            .addField(':thermometer: Température max',`${results.forecast[1].high} °C`, true)
		    .addField(':thermometer: Température min',`${results.forecast[1].low} °C`, true)
            .addField(":fire:| Ressentie", `${current.feelslike + "°C"}`, true)
            .addField(":cloud_tornado:| Vent", current.winddisplay, true)
            .addField(":droplet:| Humidité", `${current.humidity}%`, true)
            .addField(':sweat_drops: Chance de précipitation',`${results.forecast[1].precip} %`, true)
            .setFooter("Heure d'observation"+current.observationtime)
            message.channel.send(embed)
            message.delete()
		});
	},
};