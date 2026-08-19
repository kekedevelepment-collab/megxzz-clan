const { EmbedBuilder } = require('discord.js');
const db = require('./database');
const config = require('../config/config');
const logger = require('./logger');

// Resuelve qué canal usar: primero lo que se haya configurado con /consola
// para ese servidor, y si no hay nada, el logChannelId por defecto de config.js.
// Si se desactivó explícitamente con "/consola desactivar", no manda nada.
function resolveLogChannelId(guildId) {
  const data = db.read();
  const configured = data.guildConfig?.[guildId]?.logChannelId;
  if (configured === 'disabled') return null;
  if (configured) return configured;
  return config.logChannelId || null;
}

function nextCaseNumber(guildId) {
  const data = db.read();
  data.caseCounters = data.caseCounters || {};
  data.caseCounters[guildId] = (data.caseCounters[guildId] || 0) + 1;
  db.write(data);
  return data.caseCounters[guildId];
}

const ACTION_COLORS = {
  Ban: 0xe74c3c,
  Unban: 0x2ecc71,
  Kick: 0xe67e22,
  Timeout: 0xe67e22,
  Untimeout: 0x2ecc71,
  Warn: 0xf1c40f,
};

/**
 * Manda un log de moderación con numeración de caso, estilo "Case #N".
 *
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Guild} guild
 * @param {{ action: string, targetUser: import('discord.js').User, moderator?: import('discord.js').User, reason?: string, duration?: string }} options
 */
async function sendModLog(client, guild, { action, targetUser, moderator, reason, duration }) {
  const channelId = resolveLogChannelId(guild.id);
  if (!channelId) return;

  let channel;
  try {
    channel = await client.channels.fetch(channelId);
  } catch (err) {
    logger.fail(`No pude obtener el canal de logs configurado: ${err.message}`);
    return;
  }
  if (!channel || !channel.isTextBased()) return;

  const caseNumber = nextCaseNumber(guild.id);
  const now = Math.floor(Date.now() / 1000);

  const embed = new EmbedBuilder()
    .setColor(ACTION_COLORS[action] || 0x5865f2)
    .setAuthor({ name: targetUser.tag, iconURL: targetUser.displayAvatarURL() })
    .setDescription(`**Case #${caseNumber}**`)
    .addFields(
      { name: 'Action', value: action },
      { name: 'User', value: `${targetUser} (\`${targetUser.id}\`)` },
      { name: 'Moderator', value: moderator ? `${moderator} (\`${moderator.id}\`)` : 'Desconocido' },
      { name: 'Reason', value: reason || 'No especificada' },
      { name: 'Date', value: `<t:${now}:F> (<t:${now}:R>)` },
    );

  if (duration) embed.addFields({ name: 'Duration', value: duration });

  embed.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() }).setTimestamp();

  try {
    await channel.send({ embeds: [embed] });
  } catch (err) {
    logger.fail(`No pude enviar el mod-log al canal configurado: ${err.message}`);
  }
}

module.exports = { sendModLog, resolveLogChannelId };
