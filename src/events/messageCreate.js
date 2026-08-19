const { EmbedBuilder } = require('discord.js');
const db = require('../utils/database');

const xpCooldowns = new Map();
const stickyLocks = new Set();

function xpForLevel(level) {
  return 5 * level * level + 50 * level + 100;
}

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const data = db.read();
    data.afk = data.afk || {};
    data.levels = data.levels || {};
    data.stickies = data.stickies || {};

    let dirty = false;
    const afkKey = `${message.guild.id}-${message.author.id}`;

    // Quitar AFK si el usuario que estaba AFK vuelve a escribir.
    if (data.afk[afkKey]) {
      delete data.afk[afkKey];
      dirty = true;
      message.reply(`👋 Bienvenido de vuelta, ${message.author}. Te quité el estado AFK.`).catch(() => {});
    }

    // Avisar si se menciona a alguien AFK.
    for (const [, mentioned] of message.mentions.users) {
      const key = `${message.guild.id}-${mentioned.id}`;
      const afkData = data.afk[key];
      if (afkData) {
        message.reply(`💤 **${mentioned.tag}** está AFK: ${afkData.reason} (<t:${Math.floor(afkData.since / 1000)}:R>)`).catch(() => {});
      }
    }

    // Sistema de niveles (XP por mensaje, con cooldown de 60s por usuario).
    const cooldownKey = `${message.guild.id}-${message.author.id}`;
    const now = Date.now();
    if (!xpCooldowns.has(cooldownKey) || now - xpCooldowns.get(cooldownKey) > 60_000) {
      xpCooldowns.set(cooldownKey, now);

      const levelKey = `${message.guild.id}-${message.author.id}`;
      const userLevel = data.levels[levelKey] || { xp: 0, level: 0 };
      userLevel.xp += Math.floor(Math.random() * 15) + 10;

      const needed = xpForLevel(userLevel.level);
      if (userLevel.xp >= needed) {
        userLevel.xp -= needed;
        userLevel.level += 1;
        message.channel
          .send(`🎉 ${message.author} subió al **nivel ${userLevel.level}**!`)
          .catch(() => {});
      }

      data.levels[levelKey] = userLevel;
      dirty = true;
    }

    if (dirty) db.write(data);

    // Mensaje fijo (sticky) del canal.
    const sticky = data.stickies[message.channel.id];
    if (sticky && !stickyLocks.has(message.channel.id)) {
      stickyLocks.add(message.channel.id);
      try {
        if (sticky.lastMessageId) {
          const old = await message.channel.messages.fetch(sticky.lastMessageId).catch(() => null);
          if (old) await old.delete().catch(() => {});
        }
        const embed = new EmbedBuilder().setColor(0x5865f2).setDescription(sticky.content).setFooter({ text: '📌 Mensaje fijo' });
        const sent = await message.channel.send({ embeds: [embed] });

        const freshData = db.read();
        freshData.stickies = freshData.stickies || {};
        if (freshData.stickies[message.channel.id]) {
          freshData.stickies[message.channel.id].lastMessageId = sent.id;
          db.write(freshData);
        }
      } finally {
        stickyLocks.delete(message.channel.id);
      }
    }
  },
};
