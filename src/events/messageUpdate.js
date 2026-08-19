const db = require('../utils/database');
const logger = require('../utils/logger');
const { sendServerLog } = require('../utils/serverLog');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild || newMessage.partial || newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    logger.event(
      `✏️ Mensaje editado en #${newMessage.channel.name} (${newMessage.guild.name}) — ${newMessage.author.tag}: "${(oldMessage.content || '(sin texto)').slice(0, 100)}" → "${(newMessage.content || '(sin texto)').slice(0, 100)}"`,
    );

    await sendServerLog(newMessage.client, newMessage.guild.id, {
      title: '✏️ Mensaje editado',
      description: `**Usuario:** ${newMessage.author.tag} (${newMessage.author.id})\n**Canal:** ${newMessage.channel}\n\n**Antes:**\n${(oldMessage.content || '*(sin texto)*').slice(0, 500)}\n\n**Después:**\n${(newMessage.content || '*(sin texto)*').slice(0, 500)}\n\n[Ir al mensaje](${newMessage.url})`,
      color: 0xf1c40f,
    });

    const data = db.read();
    data.editSnipes = data.editSnipes || {};
    data.editSnipes[newMessage.channel.id] = {
      before: oldMessage.content || '*(sin texto)*',
      after: newMessage.content || '*(sin texto)*',
      authorId: newMessage.author.id,
      authorTag: newMessage.author.tag,
      authorAvatar: newMessage.author.displayAvatarURL(),
      timestamp: Date.now(),
    };
    db.write(data);
  },
};
