const fs = require("fs");
const discord = require("discord.js");

module.exports = {
  name: "help",
  description: "List of commands",
  /** @param {discord.Client} client * @param {discord.Interaction} interaction */
  /** @param {discord.Client} client * @param {discord.Message} message * @param {string[]} args */
  run: (client, message, args) => {
    
  }
}

function alreadyExist(folder, list) {
  for (const folderName in list) {
    if (folder === folderName) throw new Error("This Folder Already Exist")
    list[`${folder}`] = []
    fs.readdirSync(`../${folder}`).forEach(file => {
      if (list[folder].includes(file)) throw new Error("This File already Exist")
        list[folder].push(file)
    })
  }
}
function commandList(client, interaction) {
  const commandList = {}
  const categories = fs.readdirSync("../").forEach(category => {
    try {
      checkFolder(category, commandList)
    } catch (e) { console.log(e) }
  })
}
