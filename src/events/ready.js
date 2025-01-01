const discord = require('discord.js')
const functions = require("../functions/commons/index");
/** * @param {discord.Client} client */

module.exports = (client) => {
  client.informe.info("client", `El cliente - ${client.user.username.yellow.underline} - se encuentra activo`)
  client.guilds.cache.map(guild => {
    let guildConfig = client.config.get(guild.id);
    if (guildConfig === undefined) console.log(`${guild.name}<${guild.id}>: ${guildConfig}`);
    else { 
      const elements = client.config.get(guild.id, "list.server")
      let ipList = new Array();
      if (elements.length > 0) {
        elements.map((element) => {
          if (element.ip !== undefined) ipList.push(element.ip);
        })
        const serverGetter = new functions.Server(client, guild, discord);
        const getServerStatus = serverGetter.javaStatusList(ipList);
        console.log(`${guild.name}<${guild.id}>:\n`, guildConfig);
        console.log(getServerStatus); 
      }
    }
  })

}