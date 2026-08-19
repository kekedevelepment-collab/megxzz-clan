const logger = require('../utils/logger');

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const member = newState.member || oldState.member;
    if (!member) return;

    if (!oldState.channel && newState.channel) {
      logger.event(`🔊 ${member.user.tag} entró al canal de voz "${newState.channel.name}" (${newState.guild.name})`);
    } else if (oldState.channel && !newState.channel) {
      logger.event(`🔇 ${member.user.tag} salió del canal de voz "${oldState.channel.name}" (${oldState.guild.name})`);
    } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
      logger.event(
        `🔀 ${member.user.tag} se movió de "${oldState.channel.name}" a "${newState.channel.name}" (${newState.guild.name})`,
      );
    }
  },
};
