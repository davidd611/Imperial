const discord = require('discord.js');

/**
 * 
 * @param {discord.Client} client 
 * @param {discord.Interaction} interaction 
 */

module.exports = (client, interaction) => {
  if (interaction.user.bot) return;
  if (interaction.isChatInputCommand()) {
    const cmd = interaction.commandName
    
    try {
      const command = client.slashCommands.get(cmd)
      command.execute(client, interaction, ...args)
    } catch {
      client.informe.error('client', `No se encontro el comando de barra`, true, cmd, 'magenta', true);
    }
  }
}