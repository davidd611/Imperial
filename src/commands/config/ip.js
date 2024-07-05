const discord = require("discord.js");
require("colors");

//      Comando IP en general
// ===============================
module.exports = {
	data: new discord.SlashCommandBuilder()
	.setName("ip")
	.setDescription("mira la lista de ip de servidores. Las demás opciones son para el staff")
	.addStringOption(option => 
		option
		.setName("action")
		.setDescription("acción que hara el comando")
		.setChoices(
      choice_0={ name: "Añadir", value: "add", }, 
      choice_1={ name: "Limpiar", value: "clear" }, 
      choice_2={ name: "Lista", value: "list" }, 
      choice_3={ name: "Quitar", value: "remove" }
    )
		.setRequired(true)
	)
  .addStringOption(option => option.setName("serverip").setDescription("Ip de el servidor"))
  .addStringOption(option => option.setName("servername").setDescription("Nombre de el servidor")),

	execute: async(client, interaction) => {
		const opt = ["add", "clear", "list", "remove"],
		option = interaction.options.getString("action"),
		perms = interaction.member.permissions.has("Administrator"),
    server = { 
      latest: {
        ip: client.ip.get(interaction.guild.id, "ip") ?? "",
        name: client.ip.get(interaction.guild.id, "ip") ?? ""
      },
      current: {
        ip: interaction.options.getString("serverip"),
        name: interaction.options.getString("servername"),
      }
    },
    build = {
      description: {
        add: `\`\`\`js\n Se ha añadido "${server.current.ip} | ${server.current.name}" a la lista \`\`\``,
        clear: `\`\`\`js\n Se ha limpiado exitosamente la lista \`\`\``,
        error: {
          actionError: `\`\`\`js\n No Se ha Proporcionado Una Acción \`\`\``,
          argumentsError: `\`\`\`js\n No Se Ha Dado Un Valor A "serverIp" O "serverName" \`\`\``,
          permissionError: `\`\`\`js\n Careces De Los Permisos Necesarios Para Realizar Esta Acción \`\`\``,
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
    const date = new Date();
    function embedBuilder(description, field) {
    	 const embed = new discord.EmbedBuilder()
        .setDescription(description)
        .setFields(field)
        .setFooter({ iconURL: interaction.guild.iconURL(), text: `${interaction.guild.name}   •   ${date.getDay()}/${date.getMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}` })
    	interaction.reply({ embeds: [embed] })
    }
    function embedDescriptionBuilder(description) {
    	const embed = new discord.EmbedBuilder()
        .setDescription(description)
        .setFooter({ iconURL: interaction.guild.iconURL(), text: `${interaction.guild.name}   •   ${date.getDay()}/${date.getMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}` })
      interaction.reply({ embeds: [embed] })
    }
		function embedFieldBuilder(field) {
      const embed = new discord.EmbedBuilder()
       	.setFields(field)
       	.setFooter({ iconURL: interaction.guild.iconURL(), text: `${interaction.guild.name}   •   ${date.getDay()}/${date.getMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}` })
      interaction.reply({ embeds: [embed] })
		}
		if (option === opt[2]) {
			 embedBuilder(build.description.list, build.field.list) 
		} else if (perms) {
			if (option === opt[1]) {
				client.ip.set(interaction.guild.id, [], "ip"); 
				client.ip.set(interaction.guild.id, [], "name") 
				embedBuilder(build.description.clear, build.field.clear); 
			} else if (server.current.ip !== "" || !server.current.name !== "") {
				if (option === opt[0]) {
					client.ip.push(interaction.guild.id, server.current.ip, 'ip');
					client.ip.push(interaction.guild.id, server.current.name, 'name')
					embedBuilder(build.description.add, build.field.add);
				} else if (option === opt[3]) { 
					client.ip.remove(interaction.guild.id, server.current.ip, "ip"); 
					client.ip.remove(interaction.guild.id, server.current.name, "name") 
					embedBuilder(build.description.remove, build.field.remove); 
				} else {
					embedDescriptionBuilder(build.description.error.argumentsError)
				}
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
		const opt = ["add", "remove", "clear", "list"]
		/**
		 * @param {string[]} argumentos
		 * @returns 
		 */
		function verificarPermisos(argumentos) {
			const permisos = {
				administrator: message.member.permissions.has('Administrator'),
				moderator: message.member.permissions.has('ModerateMembers')
			}
		}
		/**
		 * 
		 * @param {string[]} argumentos 
		 */
		function verificarArgumentos(argumentos) {
			let resultado = {
				permitido: false
			}
			argumentos.map(i => {
				const embed = new discord.EmbedBuilder()
				.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
				if (!i) { client }
			});
		}
		try {
			/**
			var option = args[0], serverIP = args[1], serverName = args[2]
			var perms = message.member.permissions.has("Administrator")
	    let latestIP = client.ip.get(message.guild.id, "ip"), latestName = client.ip.get(message.guild.id, "name")
	    let date = new Date()
			if (option === opt[0]) { // Add Command
				if (!perms) {
					const embed = new discord.EmbedBuilder()
					.setColor("DarkRed")
					.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
					.setDescription("```js\n"+"Error: 10"+"```")
					.setTimestamp()
					message.channel.send({ embeds: [ embed ], ephemeral: true })
				} else if (!serverIP) {
					const embed = new discord.EmbedBuilder()
					.setColor("DarkRed")
					.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
					.setDescription("```js\n"+"Error: 08"+"```")
					.setTimestamp()
					message.channel.send({ embeds: [ embed ] })
				} else if (!serverName) {
					const embed = new discord.EmbedBuilder()
					.setColor("DarkRed")
					.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
					.setDescription("```js\n"+"Error: 07"+"```")
					.setTimestamp()
					message.channel.send({ embeds: [ embed ] })
				} else if (perms && serverIP && serverName) {
					client.ip.push(message.guild.id, serverIP, 'ip')
	        client.ip.push(message.guild.id, serverName, 'name')
					añadir(serverIP, 'list.server.ip')
					añadir(serverName, 'list.server.name')

					client.write.log("CLIENT", "INFO", `IP ${serverIP.magenta} has been added by ` + `${message.author.username}`.cyan.underline, "yes")

					const embed = new discord.EmbedBuilder()
					.setColor("DarkGreen")
					.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
					.setDescription("```"+`IP List\nIP added to list`+"```")
					.setFooter({ iconURL: message.guild.iconURL(), text: `${message.guild.name}   •   ${date.getDay()}/${date.getMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}` })
	        
					message.channel.send({ embeds: [ embed ] })
				}
			} else if (option === opt[1]) { // Remove Command
				if (!perms) {
					const embed = new discord.EmbedBuilder()
					.setColor("DarkRed")
					.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
					.setDescription("```js\n"+"Error: 10"+"```")
					.setTimestamp()
					message.channel.send({ embeds: [ embed ], ephemeral: true })
				} else if(!serverIP) {
					const embed = new discord.EmbedBuilder()
					.setColor("DarkRed")
					.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
					.setDescription("```js\n"+"Error: 08"+"```")
					.setTimestamp()
					message.channel.send({ embeds: [ embed ], ephemeral: true })
				} else if (!serverName) {
					const embed = new discord.EmbedBuilder()
					.setColor("DarkRed")
					.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
					.setDescription("```js\n"+"Error: 07"+"```")
					.setTimestamp()
					message.channel.send({ embeds: [ embed ] })
				} else if (perms, serverIP, serverName) {
	        if (serverIP != latestIP) {
	          client.write.log("client", "info", `IP ${serverIP.magenta.underline} ${serverName.magenta.underline} Not Found`, "yes")

	          const embed = new discord.EmbedBuilder()
	          .setColor("DarkRed")
	          .setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
	          .setDescription("```js\n" + `Error: 01` + "```")
	          .setTimestamp()

	        } else {
	          client.ip.remove(message.guild.id, serverIP, "ip")
	          client.ip.remove(message.guild.id, serverName, "name")

	          client.write.log("client", "info", `IP ${serverIP.magenta.underline} ${serverName.magenta.underline} has been removed by` + `${message.author.username}`.cyan.underline, "yes")

	          const embed = new discord.EmbedBuilder()
	          .setColor("DarkGold")
	          .setAuthor({iconURL: message.author.avatarURL(), name: message.author.username})
	          .setDescription("```js\n" + `IP LIST:\n${serverIP} has been removed` + "```")
	          .setFooter({ iconURL: message.guild.iconURL(), text: `${message.guild.name}   •   ${date.getDay()}/${date.getMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}` })

	          message.channel.send({ embeds: [embed] })
	        }
				}
			} else if (option === opt[2]) { // Clear Command
				if (!perms) {
					const embed = new discord.EmbedBuilder()
					.setColor("DarkRed")
					.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
					.setDescription("```js\n"+"Error: 10"+"```")
					.setTimestamp()
					message.channel.send({ embeds: [ embed ], ephemeral: true })
				} else {
					client.ip.set(message.guild.id, [], "ip")
	        client.ip.set(message.guild.id, [], "name")

	        client.write.log("client", "info", "ServerIp DataBase Has Been Cleared by " + `${message.author.username}`.cyan.underline, "yes")

					const embed = new discord.EmbedBuilder()
					.setColor("DarkGreen")
					.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
					.setDescription("```"+`IP List Has Cleared`+"```")
					.setFooter({ iconURL: message.guild.iconURL(), text: `${message.guild.name}   •   ${date.getDay()}/${date.getMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}` })
					message.channel.send({ embeds: [ embed ], ephemeral: true })
					console.log(`[HH:MM:SS][TYPE][CLIENT IP List ${client.ip.get(message.guild.id, 'ip').magenta} Cleared By ${message.author.username.raimbow}]`)
				}
			} else if (option === opt[3]) { // Get Command
				const embed = new discord.EmbedBuilder()
				.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
				.setDescription("```js\n"+`IP List:`+"```")
	      .setFields(
	        {
	          name: "Server IP",
	          value: "`" + `${latestIP}`.replace(/,/g, "\n") + "`",
	          inline: true
	        },
	        {
	          name: "Server Name",
	          value: "`" + `${latestName}`.replace(/,/g, "\n") + "`",
	          inline: true
	        },
	      )
	      .setFooter({ iconURL: message.guild.iconURL(), text: `${message.guild.name}   •   ${date.getDay()}/${date.getMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}` })
				message.channel.send({ embeds: [embed] });
			} else if (!option) {
	      const embed = new discord.EmbedBuilder()
				.setColor("DarkRed")
				.setAuthor({ iconURL: message.author.avatarURL(), name: message.author.username })
				.setDescription("```js\n"+'Error: 00\nUsage: i!ip option <arg>\nOptions: "add", "remove", "clear", "get", "list"'+"```")
				.setFooter({ iconURL: message.guild.iconURL(), text: `${message.guild.name}   •   ${date.getDay()}/${date.getMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}` })
				message.channel.send({ embeds: [ embed ], ephemeral: true })
	    }
			*/
		} catch (e) { client.write.error("client", e) }
	}
}