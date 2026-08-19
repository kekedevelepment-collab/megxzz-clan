const logger = require('../utils/logger');

module.exports = {
  name: 'roleCreate',
  execute(role) {
    logger.event(`🎭 Rol creado: ${role.name} en ${role.guild.name}`);
  },
};
