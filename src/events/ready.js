const discord = require('discord.js');

/** * @param {discord.Client} client */

module.exports = (client) => {
  client.informe.info("client", `El Cliente se encuentra activo`, true, client.user.username, 'yellow', true)
}