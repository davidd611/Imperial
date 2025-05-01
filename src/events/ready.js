const discord = require('discord.js')
const functions = require("../functions/commons/index");
const { GuildConfig } = require("../functions/config/index");
/** * @param {discord.Client} client */

module.exports = (client) => {
  client.informe.info("client", `El cliente - ${client.user.username.yellow.underline} - se encuentra activo`)
  
  const config = new GuildConfig(client)

  config.mapGuilds();
  /**
  client.guilds.cache.map(guild => {
  

    //console.log(`${guild.name}<${guild.id}>`);
    //client.config.clear()
    let guildConfig = client.config.get(guild.id);
    if (!guildConfig) return console.log(`${guild.name}<${guild.id}>: ${guildConfig}`);
    //if (guildConfig === undefined) console.log(`${guild.name}<${guild.id}>: ${guildConfig}`);
    //else { 
    const elements = client.config.get(guild.id, "list.server")
    let ipList = new Array();
    if (!elements) {
      elements.map((element) => {
        if (element.ip !== undefined) ipList.push(element.ip);   
        console.log(element)
      })
    }
    console.log(`${guild.name}<${guild.id}>:\n`, guildConfig);

      if (elements.length > 0) {
        elements.map((element) => {
        if (element.ip !== undefined) ipList.push(element.ip);
        console.log(element)
      })
        //const serverGetter = new functions.Server(client, guild, discord);
        //const getServerStatus = serverGetter.javaStatusList(ipList);
        console.log(`${guild.name}<${guild.id}>:\n`, guildConfig);
        //console.log(getServerStatus); 
      }

//    }
  })*/

}