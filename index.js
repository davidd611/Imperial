const informe = require('./src/functions/informe/index');
const json = require('../config.json');
const discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildMembers,
  ],
  partials: [
    discord.Partials.Channel,
    discord.Partials.Message,
    discord.Partials.User
  ]
});

let events = 0, commands = 0, slash = 0;

client.informe = informe;
client.commands = new discord.Collection();
client.slashCommands = new discord.Collection();
client.config = new Enmap({ dataDir: './src/database', name: 'config' })

const eventos = fs.readdirSync('./src/events');
for (const evento of eventos) {
  const nombreEvento = evento.split('.')[0];
  const event = require(`./src/events/${evento}`);
  client.on(nombreEvento, event.bind(null, client));
  events++
}

const comandos = fs.readdirSync('./src/commands');
for (const categoria of comandos) {
  const categories = fs.readdirSync(`./src/commands/${categoria}`).forEach(comando => {
    const nombreComando = comando.split('.')[0];
    const command = require(`./src/commands/${categoria}/${comando}`);
    if (!'run' in command) {
      client.commands.set(nombreComando, command);
      commands++;
    } else {
      client.informe.error('handler', 'No se encontro ningun escrito - run -', true, comando, 'red', true)
    }
    if ('data' in command && 'execute' in command) {
      client.slashCommands.set(command.data.name, command);
      slash++
    } else {
      client.informe.error('handler', 'No se encontro ningun escrito - data - o - execute -', true, comando, 'red', true)
    }
  });
}

client.informe.info('handler', `- ${events.toString().green} - Eventos registrados`)
client.informe.info('handler', `- ${commands.toString().green} - Comandos registrados`, false)
client.informe.info('handler', `- ${slash.toString().green} - Comandos de barra registrados`)

client.login(json.config.token.imperial)

client.on('interactionCreate', i => i)
