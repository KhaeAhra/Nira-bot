module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    category: 'Music',
    utilisation: '{prefix}nowplaying',

    execute(client, message) {

        message.delete();
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Vous n'êtes pas dans un canal vocal !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Vous n'êtes pas dans le même canal vocal !`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aucune musique en cours de lecture !`);

        const track = client.player.nowPlaying(message);
        const filters = [];

        Object.keys(client.player.getQueue(message).filters).forEach((filterName) => client.player.getQueue(message).filters[filterName]) ? filters.push(filterName) : false;

        message.channel.send({
            embed: {
                color: (client.config.discord.color),
                author: { name: track.title },
                footer: { text: '' },
                fields: [
                    { name: 'Channel', value: track.author, inline: true },
                    { name: 'Demandé par', value: track.requestedBy.username, inline: true },
                    { name: 'De la liste de lecture', value: track.fromPlaylist ? 'Oui' : 'Non', inline: true },

                    { name: 'Vues', value: track.views, inline: true },
                    { name: 'Durée', value: track.duration, inline: true },
                    { name: 'Filters activés', value: filters.length + '/' + client.filters.length, inline: true },

                    { name: 'Volume', value: client.player.getQueue(message).volume, inline: true },
                    { name: 'mode répétition', value: client.player.getQueue(message).repeatMode ? 'Oui' : 'Non', inline: true },
                    { name: 'Actuellement en pause', value: client.player.getQueue(message).paused ? 'Oui' : 'Non', inline: true },

                    { name: 'Barre de progression', value: client.player.createProgressBar(message, { timecodes: true }), inline: true }
                ],
                thumbnail: { url: track.thumbnail },
                timestamp: new Date(),
            },
        });
    },
};