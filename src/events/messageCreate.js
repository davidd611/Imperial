const discord = require("discord.js");

/** * @param {discord.Client} client * @param {discord.Message} message */
module.exports = (client, message) => {
  console.log(`Mensaje: [${message.author.username.magenta.underline}] ${message.content.cyan}`);

  const guildConfig = client.config.get(message.guild.id);
  console.log(guildConfig)
  if (guildConfig === undefined) {
    client.config.ensure(message.guild.id, {
      prefix: "i!",
      defaultPrefix: "i!",
      list: {
        server: [],
      }
    });
  }

  let prefix = client.config.get(message.guild.id, "prefix")

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase()
  
  try {
    const cmd = client.commands.get(command)
    cmd.run(client, message, args);
  } catch (e) {
    client.informe.error('client', `No se encontro el comando ${command}`);
    console.log(e)
  }
}