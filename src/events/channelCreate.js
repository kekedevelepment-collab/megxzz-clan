const logger = require('../utils/logger');

module.exports = {
  name: 'channelCreate',
  execute(channel) {
    if (!channel.guild) return;
    logger.event(`📁 Canal creado: #${channel.name} en ${channel.guild.name}`);
  },
};
