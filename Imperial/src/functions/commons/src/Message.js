
class Message {
  /**
   * @example new Message([message, discord])
   * @param {[message, discord]} param
   * @returns {[object, void]}
  */
  constructor(param) {
    this.date = new Date();
    /** @private */
    this.param = param;
  }
  embedField(description, field) {
    const embed = new this.param[1].EmbedBuilder()
     .setDescription(description)
     .setFields(field)
     .setFooter(this.timestamp())
   this.param[0].reply({ embeds: [embed] }) // Respuesta al usuario de uso
 }
 embedDescription(description) {
   const embed = new this.param[1].EmbedBuilder()
     .setDescription(description)
     .setFooter(this.timestamp())
   this.param[0].reply({ embeds: [embed] }) // Respuesta al usuario de uso
 }
  timestamp() {
    return {
      iconURL: this.param[0].guild.iconURL(),
      text: `${this.param[0].guild.name}   •   ${this.date.getDay()}/${this.date.getMonth()}/${this.date.getUTCFullYear()} ${this.date.getUTCHours()}:${this.date.getUTCMinutes()}`
    };
  }
}


module.exports = Message;