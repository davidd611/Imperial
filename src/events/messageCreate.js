const discord = require("discord.js");

/** * @param {discord.Client} client * @param {discord.Message} message */
module.exports = (client, message) => {
  try {
    console.log(`Mensaje: [${message.author.username.magenta.underline}] ${message.content.cyan}`)

    let prefix = client.config.get(message.guild.id, "prefix")

    if (message.author.bot) return;
    if (message.content.startsWith(prefix) !== true) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()
    
    try {
      const cmd = client.commands.get(command)
      cmd.run(client, message, ...args);
    } catch {
      client.informe.info('client', `No se encontro el comando ${command}`);
    }
  } catch(e) { client.informe.error('client', 'Ocurrio un error', true, e) }
  client.config.ensure(message.guild.id, {
    prefix: "",
    list: {
      server: {
        name: [],
        ip: []
      },
      modpack: {
        name: [],
        modpack: []
      }
    }
  })
}