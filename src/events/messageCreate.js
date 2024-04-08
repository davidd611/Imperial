const discord = require("discord.js");

/** * @param {discord.Client} client * @param {discord.Message} message */
module.exports = (client, message) => {
  client.informe.info('test', 'hola')
  client.config.ensure(message.guild.id, {
    prefix: "",
    ip: [],
  })
  
  console.log(client.config.get(message.guild.id, 'prefix').length)
  if (client.config.get(message.guild.id, "prefix") === "" || undefined) client.config.set(message.guild.id, "i!", "prefix")

  if (message.author.bot) return;
  if (message.content.startsWith(client.config.get(message.guild.id, "prefix"))) return;

  const args = message.content.slice(client.config.get(message.guild.id, "prefix").lenght).trim().split(/ +/g);
  const cmd = args.shift().toLocaleLowerCase()

  try {
    const command = client.commands.get(cmd)
    command.run(client, message, ...args);
  } catch {
    client.informe.info('client', `No se encontro el comando ${cmd}`);
  }
}