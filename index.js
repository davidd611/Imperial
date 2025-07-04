const { LogEntry } = require('./src/functions/informe/index');
const commons = require('./src/functions/commons/index');
const json = require('./config.json');
const { Client, GatewayIntentBits, Partials, Collection, REST, Routes, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap').default;

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
client.informe = LogEntry;
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = new Enmap({ dataDir: `${__dirname}/src/database`, name: 'config', fetchAll: false, autoFetch: true, cloneLevel: 'deep' })
client.commons = commons

const path = `${__dirname}/`
const eventos = fs.readdirSync(path + "src/events"); 
for (const evento of eventos) {
  const nombreEvento = evento.split('.')[0];
  const event = require(path + `src/events/${evento}`);
  client.on(nombreEvento, event.bind(null, client));
  events++
}

const comandos = fs.readdirSync(path + "src/commands");
for (const categoria of comandos) {
  fs.readdirSync(path + `src/commands/${categoria}`).forEach(comando => {
    const nombreComando = comando.split('.')[0];
    const command = require(path + `src/commands/${categoria}/${comando}`);
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
      client.informe.warn('handler', 'Al archivo le faltan las propiedades - data - o - execute -', '', false, true, comando, 'red', true)
    }
  });
}
client.informe.info('handler', `- ${events.toString().green} - Eventos cargados`)
client.informe.info('handler', `- ${commands.toString().green} - Comandos cargados`, false)
client.informe.info('handler', `- ${slashCommands.length.toString().green} - Comandos de barra leídos`);

const rest = new REST().setToken(json.config.token.imperial);

(async() => { 
  try { 
    client.informe.info('deploy', `- ${slashCommands.length.toString().green} - Comandos de barra recargandose en la aplicación`);

    const data = await rest.put(
      Routes.applicationCommands(json.config.client.imperial),
      { body: slashCommands}
    )
    client.informe.info('deploy', `- ${data.length.toString().green} - Comandos de barra recargados`);
  } catch (e) { 
    client.informe.error('deploy', e.message + e.stack); 
  }
})();
client.on('error', i => { console.log('[Desconectado: Error]');  } )
client.login(json.config.token.imperial)


