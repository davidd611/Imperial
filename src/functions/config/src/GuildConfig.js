require("colors");
class GuildConfig {
  constructor(client, guildId) {
    this.client = client;
    this.guildId = guildId??"No guild";
    /** @private */
    this.defaultConfig = {
      prefix: "i!",
      defaultPrefix: "i!",
      list: {
        server: [],
      }
    }
  }
  getDefault() {
    return this.defaultConfig;
  }
  getConfig(guildId) {
    const guildConfig = this.client.config.get(guildId??this.guildId)
    return guildConfig;
  }
  hasConfig(guildId) {
    const guildConfig = this.client.config.get(guildId??this.guildId);
    return (!!guildConfig);
  }
  setConfig(newConfig) {
    this.client.config.set(this.guildId, newConfig);
    return this;
  }
  mapGuilds() {
    this.client.guilds.cache.map((guild) => {
      const guildConfig = this.getConfig(guild.id);
      let message = "No configuration found".red
      let breakline = ""
      if (!!guildConfig) {message = guildConfig; breakline = "\n"}
      console.log(`${guild.name}<${guild.id}>:${breakline}`, message)
    })
  }
  voidLists(list) {
    if (!list) {
      const listError = new Error("No list found");
      listError.code = 404;
      throw listError;
    }
    return this;
  }
}

module.exports = GuildConfig