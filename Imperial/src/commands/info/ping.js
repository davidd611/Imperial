const { EmbedBuilder, Client, Message } = require('discord.js');

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {string[]} args 
   */
  run: (client, message, args) => {
    const pingEmbed = new EmbedBuilder()
    .setColor('DarkGreen')
    .setFields([ { name: client.user.username, value: client.ws.ping, inline: true } ])
    .setFooter()
  }
}