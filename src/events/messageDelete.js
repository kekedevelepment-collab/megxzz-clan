const db = require('../utils/database');
const logger = require('../utils/logger');

module.exports = {
  name: 'messageDelete',
  execute(message) {
    if (!message.guild || message.partial || message.author?.bot) return;

    logger.event(
      `🗑️ Mensaje eliminado en #${message.channel.name} (${message.guild.name}) — ${message.author.tag}: "${(message.content || '(sin texto)').slice(0, 200)}"`,
    );

    const data = db.read();
    data.snipes = data.snipes || {};
    data.snipes[message.channel.id] = {
      content: message.content || '*(sin texto, quizás una imagen o embed)*',
      authorId: message.author.id,
      authorTag: message.author.tag,
      authorAvatar: message.author.displayAvatarURL(),
      timestamp: Date.now(),
    };
    db.write(data);
  },
};
