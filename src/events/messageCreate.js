const discord = require("discord.js");

/** * @param {discord.Client} client * @param {discord.Message} message */
module.exports = (client, message) => {
  console.log(`Mensaje: [${message.author.username.magenta.underline}] ${message.content.cyan}`);

  let prefix = client.config.get(message.guild.id, "prefix")

  if (message.author.bot) return;
  if (message.content.startsWith(prefix) !== true) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  args.map(i => { console.log(`{12} [messajeCreate.js] ${i, args.indexOf(i)}`) })
  const command = args.shift().toLowerCase()
  
  try {
    const cmd = client.commands.get(command)
    cmd.run(client, message, ...args);
  } catch (e) {
    client.informe.LogEntry.error('client', `No se encontro el comando ${command}`);
    console.log(e)
  }
  client.config.ensure(message.guild.id, {
    prefix: "",
    list: {
      server: {
        name: [],
        ip: [],
        modpack: []
      },
    }
  })
}