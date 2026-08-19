require('dotenv').config();

const required = ['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Falta la variable de entorno: ${key}. Revisá tu archivo .env`);
  }
}

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,

  // ============================================================
  // CANAL DE LOGS DEL SERVIDOR
  // ============================================================
  // Poné acá el ID del canal de texto donde querés que el bot mande
  // los logs (mensajes editados/borrados, bans, kicks, timeouts,
  // mute/unmute, unban, etc). No hace falta ningún comando, el bot
  // lee este valor directamente al iniciar.
  //
  // Cómo conseguir el ID: activá el "Modo desarrollador" en Discord
  // (Configuración > Avanzado), clic derecho sobre el canal > "Copiar ID".
  //
  // Podés pegarlo directamente acá abajo, o definir la variable de
  // entorno LOG_CHANNEL_ID (en Render: Environment > Add variable).
  // Si lo dejás vacío, el bot simplemente no manda logs al canal
  // (pero los sigue mostrando en la consola).
  logChannelId: process.env.LOG_CHANNEL_ID || '1531136064243105895',
};
