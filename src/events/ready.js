const discord = require('discord.js')

/** * @param {discord.Client} client */

module.exports = (client) => {
  client.informe.info("client", `El cliente - ${client.user.username.yellow.underline} - se encuentra activo`)
  client.guilds.cache.map(guild => {
    let guildConfig = client.config.get(guild.id);
    if (guildConfig === undefined) console.log(`${guild.name}<${guild.id}>: ${guildConfig}`)
    else {console.log(`${guild.name}<${guild.id}>:\n`, guildConfig);
    }
  })

}