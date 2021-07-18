const Discord = require('discord.js')


module.exports = {
    name: 'clear',
    aliases: ['clr'],
    owner: true,
    category: 'Owner',
    utilisation: '{prefix}clear <command name>',

    execute(client, message, args) {

        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":no_entry:  Tu n'as pas la permission d'utiliser cette commande.");

        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('Indiquez un nombre valide');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('Vous devez saisir un nombre entre 1 et 99.');
        }

        message.channel.bulkDelete(amount, true).then(deletedMessages => {
            var botMessages = deletedMessages.filter(m => m.author.bot);
            var userPins = deletedMessages.filter(m => m.pinned);
            var userMessages = deletedMessages.filter(m => !m.author.bot);

            const embed = new Discord.MessageEmbed()
                .setTitle("Message(s) effacé(s)")
                .setColor(client.config.discord.color)
                .setFooter(`Demande par: ${message.author.tag}`, message.author.avatarURL())
                .setThumbnail(client.config.discord.nira)
                .setTimestamp()
                .addField(":robot: | Bot", botMessages.size, false)
                .addField(":pushpin: | Epinglés", userPins.size, false)
                .addField(":bust_in_silhouette: | Utilisiteurs", userMessages.size, false)
                .addField(":wastebasket: | Total", deletedMessages.size, false);
                message.channel.send(embed).then(msg => msg.delete({timeout: 5000}))
               
            })
        }};