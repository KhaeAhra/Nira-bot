module.exports = {
    name: 'resume',
    aliases: [],
    category: 'Music',
    utilisation: '{prefix}resume',

    execute(client, message) {

        message.delete();      
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Vous n'êtes pas dans un canal vocal !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Vous n'êtes pas dans le même canal vocal !`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aucune musique en cours de lecture !`);

        if (!client.player.getQueue(message).paused) return message.channel.send(`${client.emotes.error} - La musique joue déjà !`);

        const success = client.player.resume(message);

        if (success) message.channel.send(`${client.emotes.success} - Chanson ${client.player.getQueue(message).playing.title} a repris !`);
    },
};