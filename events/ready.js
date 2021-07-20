module.exports = async (client) => {
  
    const activities = [
      { name: 'V1.5.5', type: 'LISTENING' }, 
      { name: 'n!nira for help', type: 'LISTENING' }
    ];
  
    client.user.setPresence({ status: 'online', activity: activities[0] });
  
    let activity = 1;
  
    setInterval(() => {
      activities[2] = { name: `${client.guilds.cache.size} serveur(s)`, type: 'WATCHING' };
      activities[3] = { name: `${client.users.cache.size} utilisateur(s)`, type: 'WATCHING' };
      if (activity > 3) activity = 0;
      client.user.setActivity(activities[activity]);
      activity++;
    }, 30000);

  console.log('Nira#9228 en Ligne');
  console.log(`Connecté sur ${client.guilds.cache.size} serveur(s), pour un total de ${client.users.cache.size} utilisateurs`);
};