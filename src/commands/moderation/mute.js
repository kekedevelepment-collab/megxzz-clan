const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silencia a un usuario por un tiempo determinado.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a silenciar').setRequired(true))
    .addIntegerOption((o) => o.setName('minutos').setDescription('Duración en minutos').setRequired(true))
    .addStringOption((o) => o.setName('razon').setDescription('Razón').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const minutes = interaction.options.getInteger('minutos');
    const reason = interaction.options.getString('razon') || 'No especificada';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) return interaction.reply({ content: 'No encontré a ese usuario.', ephemeral: true });
    if (!member.moderatable) {
      return interaction.reply({ content: 'No puedo silenciar a este usuario (jerarquía de roles).', ephemeral: true });
    }
    if (minutes < 1 || minutes > 40320) {
      return interaction.reply({ content: 'La duración debe ser entre 1 minuto y 28 días.', ephemeral: true });
    }

    await member.timeout(minutes * 60 * 1000, reason);
    await interaction.reply(`🔇 ${user.tag} fue silenciado por ${minutes} minuto(s). Razón: ${reason}`);
  },
};
