const discord = require('discord.js')
const {Check, Server} = require('../../functions/commons/index')


module.exports = {
  /** @param {discord.Client} client * @param {discord.Message} message * @param {string[]} args */
  run: (client, message, args) => { // !i list <lista> <opcion> <contenido>
    const choice = args[0]??"all"
    const option = args[1]??'list'
    const argument = args[2]
    const position = args[3]
    const server = new Server([client, message, discord]);
    const values = [
      {
        choice: choice, // ip, name, modpack, version
        option: option, // options: list get, clear, add, remove, edit
        dir: "", // dir's ("ip", "name", "modpack", "version")
        arguments: argument, // "sdasdsf"
        position: position // 0, 1, 2, 3, 4, 5, 6, 7
      }
    ]
    const res = server.list(values);
    const embed = new discord.EmbedBuilder()
    .setDescription(res.message)
    if (res.code === 500) {
      if (values[0].option === "getAll") {
        console.log("C: GetAll -", res)
        let positionList = [];
        res.content.version.map((obj) => {
          const pos = res.content.version.indexOf(obj);
          console.log(pos, res.content.name)
          positionList.push(pos)
        });
        embed.setFields([
          { name: "Position", value: `\`${positionList}\``.replace(/,/g, "\n"), inline: true },
          { name: "ip", value: `\`${res.content.ip}\``.replace(/,/g, "\n"), inline: true },
          { name: "name", value: `\`${res.content.name}\``.replace(/,/g, "\n"), inline: true },
          { name: "Position", value: `\`${positionList}\``.replace(/,/g, "\n"), inline: true },
          { name: "ModPack", value: `\`${res.content.download}\``.replace(/,/g, "\n"), inline: true },
          { name: "version", value: `\`${res.content.version}\``.replace(/,/g, "\n"), inline: true },
        ]).setColor('DarkGreen')
        
      }
    }
    message.reply({ embeds: [embed] })
  }
}