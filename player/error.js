module.exports = (client, error, message, ...args) => {
    switch (error) {
        case 'NotPlaying':
            message.channel.send(`${client.emotes.error} - Il n'y a pas de musique en cours de lecture sur ce serveur !`);
            break;
        case 'NotConnected':
            message.channel.send(`${client.emotes.error} - Vous n'êtes connecté à aucun canal vocal !`);
            break;
        case 'UnableToJoin':
            message.channel.send(`${client.emotes.error} - Je n'arrive pas à rejoindre votre canal vocal, veuillez vérifier mes autorisations !`);
            break;
        case 'VideoUnavailable':
            message.channel.send(`${client.emotes.error} - ${args[0].title} N'est pas disponible dans votre pays ! Skip...`);
            break;
        case 'MusicStarting':
            message.channel.send(`La musique démarre... veuillez patienter et réessayer!`);
            break;
        default:
            message.channel.send(`${client.emotes.error} - Quelque chose s'est mal passé... Erreur : ${error}`);
    };
};