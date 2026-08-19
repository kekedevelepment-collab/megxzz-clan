const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Borra mensajes del canal actual.')
    .addIntegerOption((o) => o.setName('cantidad').setDescription('Cantidad de mensajes (1-100)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('cantidad');
    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: 'La cantidad debe ser entre 1 y 100.', ephemeral: true });
    }

    const deleted = await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `🧹 Se borraron ${deleted.size} mensaje(s).`, ephemeral: true });
  },
};
