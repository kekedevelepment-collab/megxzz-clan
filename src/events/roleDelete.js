const logger = require('../utils/logger');

module.exports = {
  name: 'roleDelete',
  execute(role) {
    logger.event(`🗑️ Rol eliminado: ${role.name} en ${role.guild.name}`);
  },
};
