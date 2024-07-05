const discord = require('discord.js'), commons = require('../functions/commons/index')

/** * @param {discord.Client} client */

module.exports = (client) => {
  client.informe.LogEntry.info("client", `El Cliente se encuentra activo`, true, client.user.username, 'yellow', true)
  client.guilds.cache.map(guild => {
    let guildConfig = client.config.get(guild.id);
    console.log(`${guild.name}<${guild.id}>:\n`, guildConfig);
  })
}