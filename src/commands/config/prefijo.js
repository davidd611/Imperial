const discord = require("discord.js");
const {Guild, Check, Message} = require('../../functions/commons/index');
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
  ),
  /** * @param {discord.Client} client  * @param {discord.Interaction} interaction */
  execute: async(client, interaction) => {
    const opcion = interaction.options.getString("accion");
    const prefijo = interaction.options.getString("prefijo");
    
    const embed = comandoPrefijo(getRealSelection(opcion), prefijo, interaction, client);
 
    await interaction.reply({ ambeds: [embed] });

  },
  /** * @param {discord.Client} client  * @param {discord.Message} message  * @param {string[]} args  */
  run: (client, message, args) => {
    const opcion = args[0] ?? "";
    const prefijo = args[1];

    console.log("[RUN] " + typeof opcion)

    const embed = comandoPrefijo(getRealSelection(opcion), prefijo, message, client);

    message.reply({ embeds: [embed] });

  }
}
/** 
 * @param { string } opcion 
 * @param { string } prefijo
 * @param { discord.Interaction } interaction
 * @param { discord.Client } client
 * @returns { embed } */
function comandoPrefijo(opcion, prefijo, interaction, client) {
  const guild = new Guild(interaction, client)
  const check = new Check(interaction, client)
  const message = new Message(interaction, discord)
  const description = `**Servidor**: ${interaction.guild.name}`
  const embed = new discord.EmbedBuilder()
  .setColor("DarkGreen")
  .setDescription(description);

  console.log("hasta aqui, bien")
  const optionList = ["show", "ver", "", "reset", "restablecer", "set", "establecer"];
  try {
    switch (opcion) {
      case ("show"): 
        // cambia el valor de fields en embed por el prefijo del servidor 
        embed.setFields([message.fieldGen("Prefijo", `\` ${guild.getPrefix()} \``, true)]);
        break;
      case "reset": 
        // Valida que el usuario tenga los permisos necesarios
        check.checkMemberPermissions("admin");
        // Cambia el los valores de description y fields del embed
        embed.setDescription(description+`\nSe ha reestablecido el prefijo exitosamente a \` ${guild.getDefaultPrefix()} \``)
        .setFields([
          message.fieldGen("Antiguo prefijo", `\` ${guild.getPrefix()} \``, true),
          message.fieldGen("Nuevo prefijo", `\` ${guild.getDefaultPrefix()} \``, true)
        ]);
        // Cambia el prefijo al prefijo por defecto
        guild.setPrefix(guild.getDefaultPrefix());
        break;
      case "set": 
        // Valida que el usuario tenga los permisos requeridos y no deje el argumento option vacio
        check.checkMemberPermissions("admin");
        check.isEmplyInput(prefijo);
        // cambia el los valores de description y fields del embed
        embed.setDescription(description+`\nEl prefijo ha sido cambiado exitosamente`)
        .setFields([
          message.fieldGen("Antiguo prefijo", `\` ${guild.getPrefix()} \``, true),
          message.fieldGen("Nuevo prefijo", `\` ${prefijo} \``, true)
        ]);
        // Cambia el prefijo al prefijo indicado
        guild.setPrefix(prefijo);
        break;
    }
    if (!optionList.includes(opcion)) embed.setColor("DarkRed")
      .setDescription(description+`\nNo se reconoce la opción - \`${opcion}\` -`);
  } catch (e) {
    console.log(e)
    embed.setColor("DarkRed").setDescription(description+`\n${e.message}`).setFields();
  }
  return embed;
}

function getRealSelection(selection) {
  let realSelection = selection;
  const options = [
    { alias: ["show", "ver", ""], selection: "show" },
    { alias: ["reset", "restablecer"], selection: "reset" },
    { alias: ["set", "establecer"], selection: "set" },
  ]
  options.map((option) => { 
    if (option.alias.includes(selection)) realSelection = option.selection; 
  })
  return realSelection;
}
