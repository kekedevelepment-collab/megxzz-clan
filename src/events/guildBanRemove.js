const { AuditLogEvent } = require('discord.js');
const logger = require('../utils/logger');
const { sendModLog } = require('../utils/modLog');

module.exports = {
  name: 'guildBanRemove',
  async execute(ban) {
    logger.event(`🕊️ ${ban.user.tag} (${ban.user.id}) fue desbaneado en ${ban.guild.name}`);

    let moderator = null;
    let reason = 'No especificada';
    try {
      const logs = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 5 });
      const entry = logs.entries.find((e) => e.target?.id === ban.user.id && Date.now() - e.createdTimestamp < 10000);
      if (entry) {
        moderator = entry.executor || null;
        reason = entry.reason || reason;
      }
    } catch (err) {
      // sin permisos de audit log, seguimos sin esos datos
    }

    await sendModLog(ban.client, ban.guild, { action: 'Unban', targetUser: ban.user, moderator, reason });
  },
};
