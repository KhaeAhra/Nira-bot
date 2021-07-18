module.exports = (client, message, queue, playlist) => {
    message.channel.send(`${client.emotes.music} - ${playlist.title} A été ajouté à la file d'attente (**${playlist.tracks.length}** chansons) !`);
};