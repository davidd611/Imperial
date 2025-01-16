class Guild {
  /**
   * @example new Guild([message, client])
   * @param { discord.Interaction | discord.Message } interaction
   * @param { discord.Client } client 
   * @returns {[object, void]}
  */
  constructor(interaction, client) {
    /** @private */
    this.interaction = interaction;
    /** @private */
    this.client = client;
  }
  /** @param {string} newPrefix */
  setPrefix(newPrefix) { this.client.config.set(this.interaction.guild.id, newPrefix, 'prefix'); }
  getDefaultPrefix() { return this.client.config.get(this.interaction.guild.id, 'defaultPrefix') }
  getPrefix() { return this.client.config.get(this.interaction.guild.id, 'prefix') }
}
module.exports = Guild;