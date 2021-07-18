

function loadCommands(client) {

    const fs = require("fs");
   
    const commandFolders = fs.readdirSync("./Commands");
    for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../Commands/${folder}/${file}`);
      client.commands.set(command.name.toLowerCase(), command);
    }}
  };

  module.exports = {
    loadCommands,
  };
