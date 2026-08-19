const { AuditLogEvent } = require('discord.js');
const logger = require('../utils/logger');
const { sendModLog } = require('../utils/modLog');

function formatDuration(ms) {
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hours`;
  const days = Math.round(hours / 24);
  return `${days} days`;
}

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    const wasTimedOut = oldMember.communicationDisabledUntilTimestamp && oldMember.communicationDisabledUntilTimestamp > Date.now();
    const isTimedOut = newMember.communicationDisabledUntilTimestamp && newMember.communicationDisabledUntilTimestamp > Date.now();

    if (!wasTimedOut && isTimedOut) {
      let moderator = null;
      let reason = 'No especificada';
      try {
        const logs = await newMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberUpdate, limit: 5 });
        const entry = logs.entries.find(
          (e) => e.target?.id === newMember.id && Date.now() - e.createdTimestamp < 10000,
        );
        if (entry) {
          moderator = entry.executor || null;
          reason = entry.reason || reason;
        }
      } catch (err) {
        // sin permisos de audit log, seguimos sin esos datos
      }

      const until = Math.floor(newMember.communicationDisabledUntilTimestamp / 1000);
      logger.event(`🔇 ${newMember.user.tag} fue silenciado (timeout/mute) hasta <t:${until}:f>`);

      await sendModLog(newMember.client, newMember.guild, {
        action: 'Timeout',
        targetUser: newMember.user,
        moderator,
        reason,
        duration: formatDuration(newMember.communicationDisabledUntilTimestamp - Date.now()),
      });
    } else if (wasTimedOut && !isTimedOut) {
      let moderator = null;
      let reason = 'No especificada';
      try {
        const logs = await newMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberUpdate, limit: 5 });
        const entry = logs.entries.find(
          (e) => e.target?.id === newMember.id && Date.now() - e.createdTimestamp < 10000,
        );
        if (entry) {
          moderator = entry.executor || null;
          reason = entry.reason || reason;
        }
      } catch (err) {
        // sin permisos de audit log, seguimos sin ese dato
      }

      logger.event(`🔊 Se le quitó el timeout/mute a ${newMember.user.tag}`);

      await sendModLog(newMember.client, newMember.guild, {
        action: 'Untimeout',
        targetUser: newMember.user,
        moderator,
        reason,
      });
    }
  },
};
