module.exports = {
    name: 'say',
    aliases: ['say'],
    owner: true,
    category: 'Owner',
    utilisation: '{prefix}say <command name>',

execute(client, message, args) {

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":no_entry:  Tu n'as pas la permission d'utiliser cette commande.");
  let botmessage = args.join(" ");
  message.delete().catch();
  message.channel.send(botmessage);
}}

