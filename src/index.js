const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const http = require('http');
const config = require('./config/config');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end('S.U.U está online.');
  })
  .listen(PORT, () => {
    logger.info(`Servidor HTTP dummy escuchando en el puerto ${PORT} (solo para que Render no mate el proceso)`);
  });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // Estos tres son necesarios para el sistema de logs de consola:
    // GuildMembers -> loguear cuando alguien entra/sale del server
    // GuildModeration -> loguear bans/desbans
    // GuildVoiceStates -> loguear cuando alguien entra/sale de un canal de voz
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

async function start() {
  loadCommands(client);
  loadEvents(client);

  try {
    const commandsData = [...client.commands.values()].map((cmd) => cmd.data.toJSON());
    const rest = new REST().setToken(config.token);
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commandsData },
    );
    logger.success(`${commandsData.length} comando(s) registrados en Discord`);
  } catch (error) {
    logger.fail('No se pudieron registrar los comandos en Discord');
    console.error(error);
  }

  try {
    await client.login(config.token);
  } catch (error) {
    logger.fail('No se pudo iniciar sesión. Revisá tu DISCORD_TOKEN en .env');
    console.error(error);
    process.exit(1);
  }
}

start();
