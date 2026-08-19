const logger = require('../utils/logger');

module.exports = {
  name: 'channelDelete',
  execute(channel) {
    if (!channel.guild) return;
    logger.event(`🗑️ Canal eliminado: #${channel.name} en ${channel.guild.name}`);
  },
};
