module.exports = (client, message, queue, track) => {
    message.channel.send(`${client.emotes.music} - ${track.title} A été ajouté à la file d'attente !`);
};