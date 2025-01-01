
class Message {
  /**
   * @example new Message([message, discord])
   * @param {[message, discord]} param
   * @returns {[object, void]}
  */
  constructor(param) {
    this.date = new Date();
    /** @private */
    this.param = param; // acceso local para los parametros 0(message) y 1(discord)
  }
  embedField(description, field) {
    const embed = new this.param[1].EmbedBuilder() // usa el objeto 1(discord) para crear el embed
     .setDescription(description)
     .setFields(field)
     .setFooter(this.timestamp())
   this.param[0].reply({ embeds: [embed] }) // Respuesta al usuario de uso
 }
 embedDescription(description) {
   const embed = new this.param[1].EmbedBuilder() // usa el objeto 1(discord) para crear el embed
     .setDescription(description)
     .setFooter(this.timestamp())
   this.param[0].reply({ embeds: [embed] }) // Respuesta al usuario de uso
  }
  /** @returns {string} */
  cutArray(array) {
    let res = [];
    if (typeof array !== "object" || array === undefined) res = " Error: array param is missing or isn't in correct format";  
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
      iconURL: this.param[0].guild.iconURL(),
      text: `${this.param[0].guild.name}   •   ${this.date.getDay()}/${this.date.getMonth()}/${this.date.getUTCFullYear()} ${this.date.getUTCHours()}:${this.date.getUTCMinutes()}`
    };
  }
}


module.exports = Message;