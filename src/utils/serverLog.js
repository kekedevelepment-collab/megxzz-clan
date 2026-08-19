const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');
const logger = require('./logger');

/**
 * Envía un embed de log al canal configurado en src/config/config.js (logChannelId).
 * Si no hay ningún canal configurado, no hace nada (el log de consola sigue funcionando igual).
 *
 * @param {import('discord.js').Client} client
 * @param {string} guildId
 * @param {{ title: string, description: string, color?: number }} options
 */
async function sendServerLog(client, guildId, { title, description, color = 0x5865f2 }) {
  if (!config.logChannelId) return;

  try {
    const channel = await client.channels.fetch(config.logChannelId);
    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setTimestamp();

    await channel.send({ embeds: [embed] });
  } catch (err) {
    logger.fail(`No pude enviar el log al canal configurado (logChannelId): ${err.message}`);
  }
}

module.exports = { sendServerLog };
