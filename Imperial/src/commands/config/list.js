const { EmbedBuilder, Message, Client } = require('discord.js')
const {Check} = require('../../functions/commons/index')


module.exports = {
  /** @param {Client} client * @param {Message} message * @param {string[]} args */
  run: (client, message, args) => {
    const consultaLista = args[1];
    const opcionLista = args[2];
    let check = new Check(args).arguments([consultaLista, opcionLista])
    console.log(check)
  }
}