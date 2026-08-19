const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendModLog } = require('../../utils/modLog');
const logger = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un usuario del servidor.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a expulsar').setRequired(true))
    .addStringOption((o) => o.setName('razon').setDescription('Razón').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'No especificada';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) return interaction.reply({ content: 'No encontré a ese usuario.', ephemeral: true });
    if (!member.kickable) {
      return interaction.reply({ content: 'No puedo expulsar a este usuario (jerarquía de roles).', ephemeral: true });
    }

    await member.kick(reason);
    await interaction.reply(`👢 ${user.tag} fue expulsado. Razón: ${reason}`);

    // El evento guildMemberRemove no distingue un kick de alguien que se va solo,
    // así que logueamos el kick acá directamente, donde sabemos con certeza qué pasó.
    logger.event(`👢 ${user.tag} (${user.id}) fue expulsado de ${interaction.guild.name} por ${interaction.user.tag}`);
    await sendModLog(interaction.client, interaction.guild, {
      action: 'Kick',
      targetUser: user,
      moderator: interaction.user,
      reason,
    });
  },
};
