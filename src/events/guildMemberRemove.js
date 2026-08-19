const logger = require('../utils/logger');

module.exports = {
  name: 'guildMemberRemove',
  execute(member) {
    logger.event(`📤 ${member.user.tag} (${member.id}) salió de ${member.guild.name}`);
  },
};
