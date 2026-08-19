const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Ajusta el modo lento del canal actual.')
    .addIntegerOption((o) => o.setName('segundos').setDescription('Segundos entre mensajes (0 para desactivar)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('segundos');
    if (seconds < 0 || seconds > 21600) {
      return interaction.reply({ content: 'Debe ser entre 0 y 21600 segundos (6 horas).', ephemeral: true });
    }

    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply(
      seconds === 0 ? '⏱️ Modo lento desactivado.' : `⏱️ Modo lento ajustado a ${seconds} segundo(s).`,
    );
  },
};
