module.exports = (client, message, query, tracks) => {
    message.channel.send({
        embed: {
            color: (client.config.discord.color),
            author: { name: `Voici les résultats de votre recherche pour ${query}` },
            thumbnail: (client.config.discord.nira),
            footer: { text: ""},
            timestamp: new Date(),
            description: `${tracks.map((t, i) => `**${i + 1}** - ${t.title}`).join('\n')}`,
        },
    });
    message.delete()
};