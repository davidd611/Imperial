const discord = require("discord.js");
const commons = require('../../functions/commons/index');
module.exports = {
  name: 'prefix',
  // options: ["show", "set", "reset"]
  description: "Muestra el prefijo. En caso de administradores, pueden cambiarlo.",
  data: new discord.SlashCommandBuilder()
	.setName("prefix")
	.setDescription("Proporciona el prefijo de el gremio actual")
	.addStringOption(option => 
		option
		.setName("accion")
		.setDescription("opcion de uso, los usuarios solo tienen acceso a ver el prefijo, no cambiarlo.")
		.setChoices(
			choice_0={ name: "Ver", value: "show" }, 
			choice_1={ name: "Cambiar", value: "set", }, 
			choice_2={ name: "resetear", value: "reset" }
    )
		.setRequired(true)
	)
  .addStringOption(option => option.setName("entrada-prefijo").setDescription("nuevo prefijo de la aplicación.")),
  execute: async(client, interaction) => {
    const accion = interaction.options.getString("accion");
    const entradaPrefijo = interaction.options.getString("entrada-prefijo");
    const revisar = new commons.Check([message, args]);
    const permisos = revisar.permissions(["admin"]);
    const argumentos = revisar.arguments([entradaPrefijo]);
    const objetosEmbed = {
      argumetos: `\`\`\`js\nFaltan argumentos\`\`\``,
      ejemplo: { name: "Ejemplo", value: `\`${gremio.prefix()}prefix set i!\``, inline: true },
      descripcion: `\`\`\`js\nPrefijo en - ${message.guild.name} -:\`\`\``,
      prefijoActual: { name: "Actual", value: `**\` ${client.config.get(message.guild.id, 'prefix')} \`**`, inline: true }
    }
    if (!accion || accion.toLowerCase() === "show") obtenerPrefijo()
    else if (permisos[0].has === true) {
      if (accion.toLowerCase() === "set") {
        if (argumentos[0].has === true) establecerNuevoPrefijo(entradaPrefijo);
        else mensaje.embedField(objetosEmbed.argumentos, [objetosEmbed.ejemplo]);
      } else if (accion.toLowerCase() === "reset") resetearPrefijo();
    }
    function establecerNuevoPrefijo(prefijo) {
      const nuevoPrefijo = client.config.set(message.guild.id, prefijo, 'prefix');
      mensaje.embedField(objetosEmbed.descripcion, [objetosEmbed.prefijoActual, nuevoPrefijo])
    }
    function resetearPrefijo() {
      const estandar = client.config.get(message.guild.id, 'defaultPrefix');
      client.config.set(message.guild.id, estandar, 'prefix');
      mensaje.embedDescription(`\`\`\`js\nPrefijo reseteado a: ${estandar}\`\`\``)
    }
    function obtenerPrefijo() {
      mensaje.embedField(objetosEmbed.descripcion, [objetosEmbed.prefijoActual])
    }
  },
  /** * @param {discord.Client} client  * @param {discord.Message} message  * @param {string[]} args  */
  run: (client, message, args) => {
    const mensaje = new commons.Message([message, discord])
    const opcion = args[0] ?? "";
    const nuevoPrefijo = args[1] ?? "";
    const revisar = new commons.Check([message, args]);
    const permisos = revisar.permissions(["admin"]);
    const gremio = new commons.Guild([message, client])
    const objetosEmbed = {
      argumetos: `\`\`\`js\nFaltan argumentos\`\`\``,
      ejemplo: { name: "Ejemplo", value: `${gremio.prefix()}prefix set i!`, inline: true },
      descripcion: `\`\`\`js\nPrefijo en - ${message.guild.name} -:\`\`\``,
      prefijoActual: { name: "Actual", value: `**\` ${client.config.get(message.guild.id, 'prefix')} \`**`, inline: true }
    }
    if (opcion.toLowerCase() === "show" || "mostrar" || !opcion) {
      mensaje.embedField(objetosEmbed.descripcion, objetosEmbed.prefijoActual)
    } else if (permisos[0].has) {
      if (opcion.toLowerCase() === "reset" || "resetear") {
        const estandar = client.config.get(message.guild.id, 'defaultPrefix');
        client.config.set(message.guild.id, estandar, 'prefix');
        mensaje.embedDescription(`\`\`\`js\nPrefijo reseteado a: ${estandar}\`\`\``)
      } else if (nuevoPrefijo !== "") { 
        if (opcion.toLowerCase() === "set" || "establecer") {
          const nuevoPrefijo = client.config.set(message.guild.id, nuevoPrefijo, 'prefix');
          mensaje.embedField(objetosEmbed.descripcion, [objetosEmbed.prefijoActual, nuevoPrefijo])
        }
      } else mensaje.embedField(objetosEmbed.argumentos, objetosEmbed.ejemplo);
    }
  }
}