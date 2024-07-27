const informe = require('./src/functions/informe/index');
const commons = require('./src/functions/commons/index');
const json = require('../config.json');
const { Client, GatewayIntentBits, Partials, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User
  ]
});

let events = 0, commands = 0, slashCommands = [];
client.informe = informe.LogEntry;
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = new Enmap({ dataDir: './src/database', name: 'config', fetchAll: false, autoFetch: true, cloneLevel: 'deep' })
client.commons = commons


const eventos = fs.readdirSync('./src/events');
for (const evento of eventos) {
  const nombreEvento = evento.split('.')[0];
  const event = require(`./src/events/${evento}`);
  client.on(nombreEvento, event.bind(null, client));
  events++
}

const comandos = fs.readdirSync('./src/commands');
for (const categoria of comandos) {
  fs.readdirSync(`./src/commands/${categoria}`).forEach(comando => {
    const nombreComando = comando.split('.')[0];
    const command = require(`./src/commands/${categoria}/${comando}`);
    if ('run' in command) {
      client.commands.set(nombreComando, command);
      commands++;
    } else {
      client.informe.warn('handler', 'No se encontro ningun escrito - run -', true, comando, 'red', true)
    }
    if ('data' in command && 'execute' in command) {
      client.slashCommands.set(command.data.name, command);
      slashCommands.push(command.data.toJSON())
    } else {
      client.informe.warn('handler', 'No se encontro ningun escrito - data - o - execute -', '', false, true, comando, 'red', true)
    }
  });
}
client.informe.info('handler', `- ${events.toString().green} - Eventos registrados`)
client.informe.info('handler', `- ${commands.toString().green} - Comandos registrados`, false)
client.informe.info('handler', `- ${slashCommands.length.toString().green} - Comandos de barra registrados`)

const rest = new REST().setToken(json.config.token.imperial);

(async () => {
  try {

    console.log(`refrescando ${slashCommands.length.toString().green} comandos de barra`);

    const data = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashCommands}
    )

    console.log(`${data.length.toString().green} comandos de barra refrescados`)
  } catch (e) { client.informe.error('handler', e) }
})

client.login(json.config.token.imperial)

client.on('shardDisconnect', i => console.log('[Desconectado]'))
