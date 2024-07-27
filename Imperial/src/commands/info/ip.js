const discord = require("discord.js");
const commons = require("../../functions/commons/index")
require("colors");

//      Comando IP en general
// ===============================
module.exports = {
	// name: 'ip',
	description: "proporciona una lista de servidores",
	// example: "%prefix%ip añadir unaip unNombre",
	// options: ["lista", "limpiar", "añadir", "remover"],
	data: new discord.SlashCommandBuilder()
	.setName("ip")
	.setDescription("proporciona una lista de servidores")
	.addStringOption(option => 
		option
		.setName("action")
		.setDescription("acción que hara el comando")
		.setChoices(
			choice_0={ name: "Lista", value: "list" }, 
			choice_1={ name: "Añadir", value: "add", }, 
			choice_2={ name: "Quitar", value: "remove" },
      choice_3={ name: "Limpiar", value: "clear" }
    )
		.setRequired(true)
	)
  .addStringOption(option => option.setName("serverip").setDescription("Ip de el servidor"))
  .addStringOption(option => option.setName("servername").setDescription("Nombre de el servidor")),

	/**
	 * 
	 * @param {discord.Client} client 
	 * @param {discord.Interaction} interaction 
	 */
	execute: async(client, interaction) => {
		const option = interaction.options.getString("action")
		const perms = interaction.member.permissions.has("Administrator")
    const server = { 
      latest: {
        ip: client.config.get(interaction.guild.id, "list.server.ip") ?? "",
        name: client.config.get(interaction.guild.id, "list.server.name") ?? ""
      },
      current: {
        ip: interaction.options.getString("serverip"),
        name: interaction.options.getString("servername"),
      }
    }
    const build = {
      description: {
        add: `\`\`\`js\n Se ha añadido "${server.current.ip} | ${server.current.name}" a la lista \`\`\``,
        clear: `\`\`\`js\n Se ha limpiado exitosamente la lista \`\`\``,
        error: {
          actionError: `\`\`\`js\nNo se ha Proporcionado Una Acción \`\`\``,
          argumentsError: `\`\`\`js\nNo se ha proporcionado un valor a - ip - o - nombre -\nEjemplo:\n${new commons.Guild([message, client]).prefix()}  \`\`\``,
          permissionError: `\`\`\`js\nCareces De Los Permisos Necesarios Para Realizar Esta Acción \`\`\``,
        },
        list: `\`\`\`js\n Lista de servidores: \`\`\``,
        remove: `\`\`\`js\n Se ha eliminado "${server.current.ip} | ${server.current.name}" de la lista \`\`\``,
      },
      field: {
        add: [{ name: "Server IP", value: `\`${server.current.ip}\``.replace(/,/g, "\n"), inline: true }, { name: "Server Name", value: `\`${server.current.name}\``.replace(/,/g, "\n"), inline: true }],
        clear: [{ name: "Server IP", value: `\`${server.latest.ip}\``.replace(/,/g, "\n"), inline: true }, { name: "Server Name", value: `\`${server.latest.name}\``.replace(/,/g, "\n"), inline: true }],
        list: [{ name: "Server IP", value: `\`${server.latest.ip}\``.replace(/,/g, "\n"), inline: true }, { name: "Server Name", value: `\`${server.latest.name}\``.replace(/,/g, "\n"), inline: true }],
        remove: [{ name: "Server IP", value: `\`${server.latest.ip}\``.replace(/,/g, "\n"), inline: true }, { name: "Server Name", value: `\`${server.latest.name}\``.replace(/,/g, "\n"), inline: true }],
      }
    }
		const MessageCommon = new commons.Message([interaction, discord])
		if (option === 'list') {
			 MessageCommon.embedField(build.description.list, build.field.list) 
		} else if (perms) {
			if (option === 'clear') {
				client.config.set(interaction.guild.id, [], "list.server.ip"); 
				client.config.set(interaction.guild.id, [], "list.server.name") 
				MessageCommon.embedField(build.description.clear, build.field.clear); 
			} else if (server.current.ip !== "" && server.current.name !== "") {
				if (option === 'add') {
					client.config.push(interaction.guild.id, server.current.ip, 'list.server.ip');
					client.config.push(interaction.guild.id, server.current.name, 'list.server.name')
					MessageCommon.embedField(build.description.add, build.field.add);
				} else if (option === 'remove') { 
					client.config.remove(interaction.guild.id, server.current.ip, "list.server.ip"); 
					client.config.remove(interaction.guild.id, server.current.name, "list.server.name") 
					MessageCommon.embedField(build.description.remove, build.field.remove); 
				}
			} else {
				MessageCommon.embedDescription(build.description.error.argumentsError)
			}
		}
	},

  // -----------------------------------------------------------------------------------------------------------------

	/**
	 * 
	 * @param {discord.Client} client 
	 * @param {discord.Message} message 
	 * @param {string[]} args 
	 */
	run: (client, message, args) => {
		const opcion = args[0] ?? "";
		const parametro1 = args[1] ?? "";
		const parametro2 = args[2] ?? "";
		const verificar =  new commons.Check([message, args])
		const permisos = verificar.permissions(['admin']);
		const servidorIp = client.config.get(message.guild.id, "list.server.ip") ?? "";
		const servidorNombre = client.config.get(message.guild.id, "list.server.name") ?? "";
		const mensajes = {
			description: {
				add: `\`\`\`js\n Se añadio "${parametro1} | ${parametro2}" a la lista \`\`\``,
				clear: `\`\`\`js\n La lista ha sido limpiada \`\`\``,
				error: {
					oopcion: `\`\`\`js\nNo se ha proporcionado una opción valida \`\`\``,
					argumentos: `\`\`\`js\nNo se ha proporcionado un valor a - ip - o - nombre -\nEjemplo:\n${new commons.Guild([message, client]).prefix()} \`\`\``,
					permisos: `\`\`\`js\nNo tienes los permisos necesarios para realizar está acción \`\`\``,
				},
				list: `\`\`\`js\n Lista de servidores: \`\`\``,
				remove: `\`\`\`js\n Se elimino "${parametro1} | ${parametro2}" de la lista \`\`\``,
			},
			field: {
				añadir: [
					{ name: "Server IP", value: `\`${parametro1}\``.replace(/,/g, "\n"), inline: true }, 
					{ name: "Server Name", value: `\`${parametro2}\``.replace(/,/g, "\n"), inline: true }
				],
				lista: [
					{ name: "Server IP", value: `\`${servidorIp}\``.replace(/,/g, "\n"), inline: true }, 
					{ name: "Server Name", value: `\`${servidorNombre}\``.replace(/,/g, "\n"), inline: true }
				]
			}
		}
		const MessageCommon = new commons.Message([message, discord])
		if (opcion.toLowerCase() === 'list' || 'lista' || !opcion) {
			 MessageCommon.embedField(mensajes.description.list, mensajes.field.lista) 
		} else if (permisos[0].has) {
			if (opcion.toLowerCase() === 'clear' || 'limpiar') {
				client.config.set(message.guild.id, [], "list.server.ip"); 
				client.config.set(message.guild.id, [], "list.server.name") 
				MessageCommon.embedField(mensajes.description.clear, mensajes.field.lista); 
			} else if (parametro1 !== "" && parametro2 !== "") {
				if (opcion.toLowerCase() === 'add' || 'añadir') {
					client.config.push(message.guild.id, parametro1, 'list.server.ip');
					client.config.push(message.guild.id, parametro2, 'list.server.name')
					MessageCommon.embedField(mensajes.description.add, mensajes.field.añadir);
				} else if (opcion.toLowerCase() === 'remove' || 'eliminar') { 
					client.config.remove(message.guild.id, parametro1, "list.server.ip"); 
					client.config.remove(message.guild.id, parametro2, "list.server.name") 
					MessageCommon.embedField(mensajes.description.remove, mensajes.field.lista); 
				} 
			} else {
				MessageCommon.embedDescription(mensajes.description.error.argumentos)
			}
		}
	}
}

