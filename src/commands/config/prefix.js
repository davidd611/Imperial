const discord = require("discord.js");

module.exports = { 

  description: "Muestra el prefijo. En caso de administradores, pueden cambiarlo.",

  /**
   * 
   * @param {discord.Client} client 
   * @param {discord.Message} message 
   * @param {string[]} args 
   */
  run: (client, message, args) => {
    message.reply({ content: 'bueno' });
  }
}