const logger = require('../utils/logger');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    logger.info(`S.U.U conectado como ${client.user.tag}`);
    client.user.setActivity('a los humanos', { type: 3 });
  },
};
