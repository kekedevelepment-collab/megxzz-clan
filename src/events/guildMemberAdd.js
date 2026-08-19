const logger = require('../utils/logger');

module.exports = {
  name: 'guildMemberAdd',
  execute(member) {
    logger.event(`📥 ${member.user.tag} (${member.id}) se unió a ${member.guild.name}`);
  },
};
