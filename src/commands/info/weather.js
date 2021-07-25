const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const weather = require('weather-js');

module.exports = class WeatherCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'weather',
      aliases: ['meteo', 'temps'],
      usage: 'weather [ville]',
      description: `Donne la météo d'un endroit donné`,
      type: client.types.INFO,
      examples: ['weather Paris']
    });
  }
  run(message, args) {

		let embed, search;
		search = args.join(' ');
		if(!search) return message.channel.send(' Ajoute une ville à la commande ');

		weather.find({ search:search, degreeType: 'C' }, function(err, result) {
			if(err) console.log(err);
			if(!result[0]) return message.channel.send(' Ville introuvable :scream: ');
			const current = result[0].current;
			const location = result[0].location;
			const results = result[0];
			const temps = {
                'Sunny': 'Soleil',
                'Clear': 'Dégagé',
                'Mostly Sunny': 'Assez ensoleillé',
                'Cloudy': 'Nuageux',
                'Mostly Cloudy': 'Plutôt nuageux',
                'Snow': 'Temps enneigé',
                'Light Rain': 'Pluie légère',
                'Partly Sunny': 'Partiellement ensoleillé',
                'T-Storm': 'Tempêtes',
                'Partly Cloudy': 'Partiellement nuageux',
                'Rain Showers': 'Averses de pluie',
                'Light Snow': 'Neige légère',
                'Mostly Clear': 'Plutôt dégagé',
                'Rain': 'Pluie',
                'Snow': 'Neige',
            };

			const jours = {
                'Monday': "Lundi",
                'Tuesday': "Mardi",
                'Wednesday': "Mercredi",
                'Thursday': "Jeudi",
                'Friday': "Vendredi",
                'Saturday': "Samedi",
                'Sunday': "Dimanche",
            };

			const embed = new MessageEmbed()
			.setAuthor(` Météo pour ${current.observationpoint}`)
            .setDescription(`Voici les prévisions ${message.author}`)  //+ message.author.username)
            .setTimestamp() 
            .setThumbnail(current.imageUrl)
            .setColor(message.guild.me.displayHexColor)
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
	}
};