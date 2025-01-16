const discord = require('discord.js'); 
const {Message, Server} = require('../../functions/commons/index');

module.exports = {
  name: "list",
  // options: ["list", "clear", "add", "remove", "edit"],
  // lists: ["ip", "modpack", "version", "status"]
  description: "Almacenamiento de listas especializadas en servidores.",
  data: new discord.SlashCommandBuilder()
	.setName("list")
	.setDescription("Almacenamiento de listas especializadas en servidores.")
	.addStringOption(o => 
    o.setName("option")
    .setDescription("Opcion sobre que hacer con la lista")
    .setChoices(
      choice_0={ name: "Lista", value: "list" }, 
			choice_1={ name: "Añadir", value: "add", }, 
      choice_3={ name: "Eliminar", value: "remove" },
      choice_4={ name: "Editar", value: "edit" },
      choice_5={ name: "Limpiar", value: "clear" },
    )
  )
  .addStringOption(o => 
    o.setName("list")
    .setDescription("Lista que será usada")
    .setChoices(
      choice_0={ name: "ip", value: "ip" }, 
			choice_1={ name: "name", value: "name", }, 
			choice_2={ name: "modpack", value: "modpack" },
      choice_3={ name: "versión", value: "version" },
    )
  )
  .addStringOption(o => o.setName("content").setDescription("Nueva entrada o entrada existente"))
  .addIntegerOption(o => o.setName("position").setDescription("Posición de el elemento")),
  /** @TODO Trabajar a partir de ahora en adaptar el contenido del comando run en el execute */
  /** @param {discord.Client} client * @param {discord.Interaction} interaction */
  execute: async (client, interaction) => {
    const mensaje = new Message(interaction, discord);
    const servidor = new Server(client, interaction);
    const opcion = interaction.options.getString("option")??"list"
    const lista = interaction.options.getString("list")??"";
    const entradas = {
      option: opcion.toLowerCase(),
      list: lista.toLowerCase(),
      content: interaction.options.getString("content"),
      position: interaction.options.getInteger("position")
    }
    const salida = servidor.list(entradas);
    const embed = new discord.EmbedBuilder().setDescription(`\`\`\`\n${salida.message}\`\`\``);
    if (salida.code === 500) {
      embed.setFields([
        mensaje.arrayFieldGen("position", salida.content.position, true),
        mensaje.arrayFieldGen("name", salida.content.name, true),
        mensaje.arrayFieldGen("version", salida.content.version, true)
      ]);
    }
    const component = new discord.ActionRowBuilder().addComponents(
      new discord.StringSelectMenuBuilder().setCustomId("slash-server-menu")
      .setOptions(
        new discord.StringSelectMenuOptionBuilder().setLabel("ip").setValue("sip"),
        new discord.StringSelectMenuOptionBuilder().setLabel("version").setValue("sversion"),
        new discord.StringSelectMenuOptionBuilder().setLabel("modpack").setValue("smodpack"),
        new discord.StringSelectMenuOptionBuilder().setLabel("status").setValue("sstatus"),
      )
    );
    const msg = await interaction.reply({ embeds: [embed] });
    menu(client, msg, servidor, mensaje, embed, component, salida)
  },
  //-------------------------------------------------------------------------------------------
  /** @param {discord.Client} client * @param {discord.Message} message * @param {string[]} args */
  run: (client, message, args) => { // !i list <lista> <opcion> <contenido> <posicion>
    const opcion = args[0]??"list";
    const lista = args[1]??""
    const contenido = args[2];
    const posicion = args[3];
    const entradas = { option: opcion.toLowerCase(), list: lista.toLowerCase(), content: contenido, position: posicion }
    const mensaje = new Message(message, discord);
    const servidor = new Server(client, message);
    const salida = servidor.list(entradas);
    console.log("[run] - entradas:\n", opcion, lista, contenido, posicion);
    const embed = new discord.EmbedBuilder().setDescription(`\`\`\`\n${salida.message}\`\`\``)
    if (salida.code === 500) {
      embed.setFields([
        mensaje.arrayFieldGen("position", salida.content.position, true),
        mensaje.arrayFieldGen("name", salida.content.name, true),
        mensaje.arrayFieldGen("version", salida.content.version, true)
      ]);
    }
    const component = new discord.ActionRowBuilder().addComponents(
      new discord.StringSelectMenuBuilder().setCustomId("argument-server-menu")
      .setOptions(
        new discord.StringSelectMenuOptionBuilder().setLabel("ip").setValue("sip"),
        new discord.StringSelectMenuOptionBuilder().setLabel("version").setValue("sversion"),
        new discord.StringSelectMenuOptionBuilder().setLabel("modpack").setValue("smodpack"),
        new discord.StringSelectMenuOptionBuilder().setLabel("status").setValue("sstatus"),
      )
    );
    const response = message.reply({ embeds: [embed] })
    response.then(msg => {
      menu(client, msg, servidor, mensaje, embed, component, salida)
    });
  },
}

function menu(client, msg, servidor, mensaje, embed, component, salida) {
  if (salida.code === 500) msg.edit({ embeds: [embed], components: [component] });
  servidor.javaStatusList();
  const collector = msg.createMessageComponentCollector({componentType: discord.ComponentType.StringSelect, time: 900000})
  collector.on("collect", async (collect) => {
    try { collect.deferUpdate() } catch (e) { client.informe.error("list.collector.deferUpdate", e) }
    function editEmbedList(name, arr, p) {
      if (typeof arr === typeof [""]) {
        embed.setDescription(`\`\`\`\nLista de ${name}es\`\`\``)
        .setFields([
          mensaje.arrayFieldGen("position", salida.content.position, true),
          mensaje.arrayFieldGen("name", salida.content.name, true),
          mensaje.arrayFieldGen(name, arr, true)
        ])
        if (p !== undefined) console.log("[list.reply.editEmbedList<name, arr, p>]: " + p);
      }
    }
    const value = collect.values.shift();
    switch (value) {
      case "sip": editEmbedList("ip", salida.content.ip, value); break;
      case "sversion": editEmbedList("version", salida.content.version, value); break;
      case "smodpack": editEmbedList("modpack", salida.content.modpack, value); break;
      case "sstatus": 
      const estadoJava = servidor.getall().content.status;
      editEmbedList("status", estadoJava, value);
      break;
    }
    msg.edit({ embeds: [embed], components: [component] });
  })
}