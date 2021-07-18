const Discord = require('discord.js');

module.exports = {
    name: 'servlist',
    aliases: ['servl'],
    owner: true,
    category: 'Owner',
    utilisation: '{prefix}servlist <command name>',

    execute(client, message, args) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":no_entry:  Tu n'as pas la permission d'utiliser cette commande.");

        this.client = message.client;
        let i0 = 0;
        let i1 = 10;
        let page = 1;

        let description =
            `Nombre de serveurs : ${this.client.guilds.cache.size}\n\n` +
            this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
            .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Membres`)
            .slice(0, 10)
            .join("\n");

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Liste des serveurs ${page}/${Math.ceil(this.client.guilds.cache.size/10)}`)
            .setColor(client.config.discord.color)
            .setThumbnail(client.config.discord.nira)
            .setDescription(description)
            .setFooter(`Demande par: ${message.author.tag}`, message.author.avatarURL());

        message.channel.send(embed);

         message.react("⬅");
         message.react("➡");
         message.react("❌");

        const collector = message.createReactionCollector((reaction, user) => user.id === message.author.id);

        collector.on("collect", async(reaction) => {

            if (reaction._emoji.name === "⬅") {

                i0 = i0 - 10;
                i1 = i1 - 10;
                page = page - 1;

                if (i0 < 0) {
                    return message.delete();
                }
                if (!i0 || !i1) {
                    return message.delete();
                }

                description = `Serveurs: ${this.client.guilds.cache.size}\n\n` +
                    this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
                    .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Membres`)
                    .slice(i0, i1)
                    .join("\n");

               
                embed.setTitle(`page: ${page}/${Math.round(this.client.guilds.cache.size/10)}`)
                    .setDescription(description);

                // Edit the message 
                message.edit(embed);

            }

            if (reaction._emoji.name === "➡") {

                
                i0 = i0 + 10;
                i1 = i1 + 10;
                page = page + 1;

                
                if (i1 > this.client.guilds.cache.size + 10) {
                    return message.delete();
                }
                if (!i0 || !i1) {
                    return message.delete();
                }

                description = `Serveurs: ${this.client.guilds.cache.size}\n\n` +
                    this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
                    .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} membres`)
                    .slice(i0, i1)
                    .join("\n");

                
                embed.setTitle(`Page: ${page}/${Math.round(this.client.guilds.cache.size/10)}`)
                    .setDescription(description);

               
                message.edit(embed);

            }

            if (reaction._emoji.name === "❌") {
                return message.delete();
            }

            // Remove the reaction when the user react to the message
            reaction.users.remove(message.author.id);

        });
    },
};
