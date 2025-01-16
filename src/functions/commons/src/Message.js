
class Message {
  /**
   * @example new Message([message, discord])
   * @param {[message, discord]} param
   * @returns {[object, void]}
  */
  constructor(interaction, discord) {
    this.date = new Date();
    /** @private */
    this.interaction = interaction;
    /** @private */
    this.discord = discord;
  }
  embedField(description, field) {
    const embed = new this.discord.EmbedBuilder() // usa el objeto 1(discord) para crear el embed
     .setDescription(description)
     .setFields(field)
     .setFooter(this.timestamp())
 }
 embedDescription(description) {
   const embed = new this.discord.EmbedBuilder() // usa el objeto 1(discord) para crear el embed
     .setDescription(description)
     .setFooter(this.timestamp())
   this.interaction.reply({ embeds: [embed] }) // Respuesta al usuario de uso
  }
  /** @returns {string} */
  cutArray(array) {
    let res = [];
    let reverse = array.reverse(); // invierte el orden del array
    let endPos; // se coloca la posición
    reverse.map(string => {
      if (typeof endPos !== "number" && string !== "") endPos = reverse.indexOf(string);
      if (typeof endPos === "number") res.push(string); // Lo añade al array que devolverá
    });
    let retorno = `\`\`\`\n${res.reverse()}\`\`\``;
    if (retorno.length === 7) retorno = " ";
    array.reverse();
    console.log(retorno)
    return retorno // Devuelve el array -res- en un string
  }
  /** @param {string} name * @param {string} value * @param {boolean} inline * @returns {object} */
  fieldGen(name, value, inline) {
    const res = { 
      name: name, 
      value: value,
      inline: inline??false
    }
    return res;
  }
  /** @returns {object} */
  arrayFieldGen(name, value, inline) {
    const res = { 
      name: name, 
      value: this.cutArray(value).replace(/,/g, "\n"),
      inline: inline??false
    }
    return res;
  }
  timestamp() {
    return {
      iconURL: this.interaction.guild.iconURL(),
      text: `${this.interaction.guild.name}   •   ${this.date.getDay()}/${this.date.getMonth()}/${this.date.getUTCFullYear()} ${this.date.getUTCHours()}:${this.date.getUTCMinutes()}`
    };
  }
}


module.exports = Message;