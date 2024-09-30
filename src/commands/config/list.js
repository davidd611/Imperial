const discord = require('discord.js')
const {Message, Server} = require('../../functions/commons/index');

module.exports = {
  name: "list",
  // options: ["list", "get" "getseps", "clear", "add", "remove", "edit"],
  // lists: ["ip", "name", "modpack", "version"]
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
			choice_2={ name: "Elemento", value: "getseprops" },
      choice_3={ name: "Eliminar", value: "remove" },
      choice_4={ name: "Editar", value: "edit" },
      choice_5={ name: "Limpiar", value: "clear" },
      choice_6={ name: "Propiedad", value: "getseprop" },
    )
  )
  .addStringOption(o => 
    o.setName("list")
    .setDescription("Lista que será usada")
    .setChoices(
      choice_0={ name: "ip", value: "list" }, 
			choice_1={ name: "name", value: "add", }, 
			choice_2={ name: "modpack", value: "remove" },
      choice_3={ name: "versión", value: "remove" },
    )
  )
  .addStringOption(o => o.setName("content").setDescription("Nueva entrada o entrada existente"))
  .addIntegerOption(o => o.setName("position").setDescription("Posición de el elemento")),
  /** @param {discord.Client} client * @param {discord.Interaction} interaction */
  execute: async(client, interaction) => {
    const entradas = {
      option: interaction.options.getString("option"),
      list: interaction.options.getString("list"),
      content: interaction.options.getString("content"),
      position: interaction.options.getInteger("position")
    }
    const listas = new Server([client, interaction])
    .list(entradas);
    console.log("[execute] - listas:\n", listas);
    console.log("[execute] - entradas:\n", entradas["list"], entradas["option"], entradas["content"], entradas["position"]);
  },
  /** @param {discord.Client} client * @param {discord.Message} message * @param {string[]} args */
  run: (client, message, args) => { // !i list <lista> <opcion> <contenido> <posicion>
    const opcion = args[0]??"list";
    const lista = args[1];
    const contenido = args[2];
    const posicion = args[3];
    const entradas = { option: opcion, list: lista, content: contenido, position: posicion }
    const servidor = new Server([client, message]);
    const salida = servidor.list(entradas);
    console.log("[run] - entradas:\n", opcion, lista, contenido, posicion);
    function fieldGen(name, value, inline) {
      let TI = "";
      console.log(value.length, value);
      
      const res = { 
        name: name, 
        value: "",
        inline: inline 
      }
      let values = []
      value.map((val) => {
        if (val !== "") TI = "\`\`\`"; else TI = "";
        values.push(`${TI}${val}${TI}`)
      });
      res.valie = `${values}`.replace(/,/g, "\n")
      return res;
    }
    const embed = new discord.EmbedBuilder()
    .setDescription(`\`\`\`\n${salida.message}\`\`\``)
    if (salida.code === 500) {
      embed.setFields([
        fieldGen("position", salida.content.position, true),
        fieldGen("name", salida.content.name, true),
        fieldGen("version", salida.content.version, true)
      ]);
    }
    message.reply({ embeds: [embed] });

    /**
     * Descripcion
     * Elementos
     */
  }
}