const informe = require('./src/functions/informe/index');
const json = require('../config.json');
const discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildMessageTyping,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.GuildInvites,
    discord.GatewayIntentBits.GuildPresences,
    discord.GatewayIntentBits.DirectMessages,
    discord.GatewayIntentBits.DirectMessageReactions,
    discord.GatewayIntentBits.DirectMessageTyping,
    discord.GatewayIntentBits.MessageContent
  ],
  partials: [
    discord.Partials.Channel,
    discord.Partials.Message,
    discord.Partials.User
  ]
});

let events = 0, commands = 0, slashCommands = [];

client.informe = informe;
client.commands = new discord.Collection();
client.slashCommands = new discord.Collection();
client.config = new Enmap({ dataDir: './src/database', name: 'config', fetchAll: false, autoFetch: true, cloneLevel: 'deep' })


client.config.map(e => console.log(e))
console.log(client.config)
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
    if ('run' in command) {
      client.commands.set(nombreComando, command);
      commands++;
    } else {
      client.informe.error('handler', 'No se encontro ningun escrito - run -', true, comando, 'red', true)
    }
    if ('data' in command && 'execute' in command) {
      client.slashCommands.set(command.data.name, command);
      slashCommands.push(command.data.toJSON())
    } else {
      client.informe.error('handler', 'No se encontro ningun escrito - data - o - execute -', true, comando, 'red', true)
    }
  });
}

client.informe.info('handler', `- ${events.toString().green} - Eventos registrados`)
client.informe.info('handler', `- ${commands.toString().green} - Comandos registrados`, false)
client.informe.info('handler', `- ${slashCommands.length.toString().green} - Comandos de barra registrados`)

const rest = new discord.REST().setToken(json.config.token.imperial);

(async () => {
  try {

    console.log(`refrescando ${slashCommands.length.toString.green} comandos de barra`);

    const data = await rest.put(
      discord.Routes.applicationCommands(client.user.id),
      { body: slashCommands}
    )

    console.log(`${data.length.toString().green} comandos de barra refrescados`)
  } catch (e) { client.informe.error('handler', e) }
})

client.login(json.config.token.imperial)

client.on('guildDelete', i => i)
