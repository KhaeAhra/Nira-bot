module.exports = async (client) => {
  
    const activities = [
      { name: 'MAJ en préparation', type: 'LISTENING' }, 
      { name: 'V1.5.5 >V2.0.0 process', type: 'LISTENING' }
    ];
  
    client.user.setPresence({ status: 'dnd', activity: activities[0] });
  
    let activity = 1;
  
    setInterval(() => {
      activities[2] = { name: `${client.guilds.cache.size} serveur(s)`, type: 'WATCHING' };
      activities[3] = { name: `${client.users.cache.size} utilisateur(s)`, type: 'WATCHING' };
      if (activity > 3) activity = 0;
      client.user.setActivity(activities[activity]);
      activity++;
    }, 30000);

  console.log(`${client.user.username} en Ligne`);
  console.log(`Connecté sur ${client.guilds.cache.size} serveur(s), pour un total de ${client.users.cache.size} utilisateurs`);
};