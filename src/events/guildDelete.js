const discord = require('discord.js');

/**
 * 
 * @param {discord.Client} client 
 * @param {discord.Guild} guild 
 */

module.exports = (client, guild) => {
  client.config.delete(guild.id)
  client.informe.LogEntry.info('client', 'Se elimino el servidor', true, guild.name, 'magenta', true)
}