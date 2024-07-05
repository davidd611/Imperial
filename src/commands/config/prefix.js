const { Client, Message, EmbedBuilder } = require("discord.js");
const { Embed } = require('../../functions/commons/index');
module.exports = {
  name: 'prefix',
  description: "Muestra el prefijo. En caso de administradores, pueden cambiarlo.",
  /** * @param {Client} client  * @param {Message} message  * @param {string[]} args  */
  run: (client, message, args) => {
    console.log('{8} [prefix.js] ' + args);
    const common = new Embed(client, message, args)
    const embed = new EmbedBuilder()
      .setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
      .setFooter(common.defaultFooter())
    const prefijoActual = client.config.get(message.guild.id, 'prefix')
    function embedObtenerPrefijo() { 
      message.reply({ embeds: [embed.setDescription(`\`\`\`js\n${prefijoActual}\`\`\``).setColor('Random')], }); 
    }
    const opciones = [[args].indexOf('set')] 
    console.log('{17} [prefix.js] '+opciones[0])
      
    if (opciones === 1) {
      const opcion = args[1] || ""; // i!prefix <opcion>
      const prefijo = args[2] || ""; // i!prefix <opcion> <prefijo>
      // Verificar si los permisos/argumentos son validos
      const verificar = new client.commons.Verificacion(client, message, args);
      const permisos = verificar.permisos(['admin'])
      const parametros = verificar.parametros([opcion, prefijo])
      function requisitos() {
        if (permisos === false) return message.reply({ embeds: [common.error(['permisos insuficientes'])] })
        if (parametros[0] === true) return message.reply({ embeds: [common.error(`${parametros[1].toString().replace(/,/g, '\n')}`)] })
      }
      // Establece el prefijo si todo esta bien
      function establecerPrefijo(prefijo) {
        requisitos(); message.reply({ embeds: [embed.setDescription(`\`\`\`js\nPrefix cambiado de - ${prefijoActual} - a - ${prefijo} -\`\`\``).setColor('DarkGreen')] });
        client.config.set(message.guild.id, prefijo, 'prefix')
      }
      return establecerPrefijo();
    } else if (opciones === -1) return embedObtenerPrefijo()
  }
}