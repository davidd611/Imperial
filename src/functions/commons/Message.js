
class Message {
  constructor() {
    this.date = new Date();
  }
  timestamp() {
    return {
      iconURL: this.mein.guild.iconURL(),
      text: `${this.mein.guild.name}   •   ${date.getDay()}/${date.getMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}`
    };
  }
}
module.exports = Message;