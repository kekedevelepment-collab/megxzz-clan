const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-close')
    .setDescription('Cierra el ticket actual.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: 'Este comando solo se puede usar dentro de un canal de ticket.', ephemeral: true });
    }

    await interaction.reply('🔒 Este ticket se cerrará en 5 segundos...');
    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 5000);
  },
};
