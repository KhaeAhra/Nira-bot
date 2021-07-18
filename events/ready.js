module.exports = async (client) => {
    console.log(process.pid)
    console.log(`${client.user.tag} en ligne`);
    console.log(`Connecté sur ${client.guilds.cache.size} serveur(s), pour un total de ${client.users.cache.size} utilisateurs`);
    client.user.setPresence(client.config.discord.presence);
    
};