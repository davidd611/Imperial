const discord = require("discord.js");
const commons = require('../../functions/commons/index');
module.exports = {
  name: 'prefix',
  // options: ["show", "set", "reset"]
  description: "Muestra el prefijo. En caso de administradores, pueden cambiarlo.",
  data: new discord.SlashCommandBuilder()
	.setName("prefijo")
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
  .addStringOption(option => 
    option
    .setName('prefijo')
    .setDescription('prefijo que será usado')
  )
  .addStringOption(option => option.setName("entrada-prefijo").setDescription("nuevo prefijo de la aplicación.")),
  /** * @param {discord.Client} client  * @param {discord.Interaction} interaction */
  execute: async(client, interaction) => {
    const gremio = new commons.Guild([interaction, client]) 
    const mensaje = new commons.Message([interaction, discord])
    const revisar = new commons.Check([interaction]);
    const opcion = interaction.options.getString("accion");
    const prefijo = interaction.options.getString("prefijo");
    const permisos = revisar.permissions(["admin"]);
    const porDefecto = client.config.get(interaction.guild.id, 'defaultPrefix');
    const respuesta = {
      descripcion: {
        servidor: `\`\`\`js\nServidor: - ${interaction.guild.name} -\`\`\``,
        error: {
          argumetos: `\`\`\`js\nFalta el prefijo\`\`\``,
          desconocido: `\`\`\`js\nOpcion desconocida - ${opcion} -\`\`\``,
        },
        usuario: `\`\`\`js\nUsuario - ${interaction.member.user.username} -\`\`\``,
      },
      campo: {
        error: {
          ejemplo: { name: "Ejemplo", value: `${gremio.prefix()}prefix set i!`, inline: true },
          permisos: { name: 'Permisos necesarios', value: 'Admin' },
        },
        prefijoActual: { name: "Actual", value: `**\` ${gremio.prefix()} \`**`, inline: true },
        prefijoPorDefecto: { name: "Nuevo", value: `**\` ${porDefecto} \`**`, inline: true },
        prefijoNuevo: { name: "Nuevo", value: `**\` ${prefijo} \`**`, inline: true },
      },
    }
    if (opcion === 'show' || opcion === 'ver' || !opcion ) {
      mensaje.embedField(respuesta.descripcion.servidor, respuesta.campo.prefijoActual)
    } else if (permisos[0].has) {
      if (opcion === 'reset' || opcion === 'restablecer') {
        client.config.set(interaction.guild.id, porDefecto, 'prefix');
        mensaje.embedField(respuesta.descripcion.servidor, [respuesta.campo.prefijoActual, respuesta.campo.prefijoPorDefecto])
      } else if (opcion === 'set' || opcion === 'establecer') {
        if (prefijo !== "") {
          client.config.set(interaction.guild.id, prefijo, 'prefix');
          mensaje.embedField(respuesta.descripcion.servidor, [respuesta.campo.prefijoActual, respuesta.campo.prefijoNuevo])
        } else mensaje.embedField(respuesta.descripcion.error.argumetos, respuesta.campo.error.ejemplo);
      } else mensaje.embedDescription(respuesta.descripcion.error.desconocido)
    } else mensaje.embedField(respuesta.descripcion.usuario, respuesta.campo.error.permisos)

    /*
    if (!accion || accion === "show") {
      mensaje.embedField(objetosEmbed.descripcion, objetosEmbed.prefijoActual)
    } else if (permisos[0].has) {
      if (accion === 'reset') {
        const estandar = client.config.get(interaction.guild.id, 'defaultPrefix');
        client.config.set(interaction.guild.id, estandar, 'prefix');
        mensaje.embedDescription(`\`\`\`js\nPrefijo reseteado a: ${estandar}\`\`\``)
      } else if (prefijo !== "") {
        if (accion === 'set') {
          const prefijoConfig = client.config.set(interaction.guild.id, prefijo, 'prefix');
          console.log(`[prefix.js] [set] ${prefijoConfig}`)
          mensaje.embedField(objetosEmbed.descripcion, objetosEmbed.prefijoActual)
        }
      } else {
        mensaje.embedField(objetosEmbed.prefijos, objetosEmbed.ejemplo); 
      }
    }
      */
  },
  /** * @param {discord.Client} client  * @param {discord.Message} message  * @param {string[]} args  */
  run: (client, message, args) => {
    const entrada = args[0] ?? "";
    const gremio = new commons.Guild([message, client])
    const mensaje = new commons.Message([message, discord])
    const opcion = entrada.toLowerCase();
    const porDefecto = client.config.get(message.guild.id, 'defaultPrefix');
    const prefijo = args[1] ?? "";
    const verificar = new commons.Check([message, args], true);
		const permisos = verificar.permissions(['admin']);
    const respuesta = {
      descripcion: {
        servidor: `\`\`\`js\nServidor: - ${message.guild.name} -\`\`\``,
        error: {
          argumetos: `\`\`\`js\nFalta el prefijo\`\`\``,
          desconocido: `\`\`\`js\nOpcion desconocida - ${opcion} -\`\`\``,
        },
        usuario: `\`\`\`js\nUsuario - ${message.author.username} -\`\`\``,
      },
      campo: {
        error: {
          ejemplo: { name: "Ejemplo", value: `${gremio.prefix()}prefix set i!`, inline: true },
          permisos: { name: 'Permisos necesarios', value: 'Admin' },
        },
        prefijoActual: { name: "Actual", value: `**\` ${gremio.prefix()} \`**`, inline: true },
        prefijoPorDefecto: { name: "Nuevo", value: `**\` ${porDefecto} \`**`, inline: true },
        prefijoNuevo: { name: "Nuevo", value: `**\` ${prefijo} \`**`, inline: true },
      },
    }
    if (opcion === 'show' || opcion === 'ver' || !opcion ) {
      mensaje.embedField(respuesta.descripcion.servidor, respuesta.campo.prefijoActual)
    } else if (permisos[0].has) {
      if (opcion === 'reset' || opcion === 'restablecer') {
        client.config.set(message.guild.id, porDefecto, 'prefix');
        mensaje.embedField(respuesta.descripcion.servidor, [respuesta.campo.prefijoActual, respuesta.campo.prefijoPorDefecto])
      } else if (opcion === 'set' || opcion === 'establecer') {
        if (prefijo !== "") {
          client.config.set(message.guild.id, prefijo, 'prefix');
          mensaje.embedField(respuesta.descripcion.servidor, [respuesta.campo.prefijoActual, respuesta.campo.prefijoNuevo])
        } else mensaje.embedField(respuesta.descripcion.error.argumetos, respuesta.campo.error.ejemplo);
      } else mensaje.embedDescription(respuesta.descripcion.error.desconocido)
    } else mensaje.embedField(respuesta.descripcion.usuario, respuesta.campo.error.permisos)
  }
}