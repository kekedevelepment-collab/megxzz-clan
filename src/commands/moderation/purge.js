const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Borra varios mensajes, opcionalmente de un usuario específico.')
    .addIntegerOption((o) => o.setName('cantidad').setDescription('Cantidad de mensajes (1-100)').setRequired(true))
    .addUserOption((o) => o.setName('usuario').setDescription('Borrar solo mensajes de este usuario').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('cantidad');
    const user = interaction.options.getUser('usuario');

    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: 'La cantidad debe ser entre 1 y 100.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    const filtered = user ? messages.filter((m) => m.author.id === user.id).first(amount) : messages.first(amount);

    const deleted = await interaction.channel.bulkDelete(filtered, true);

    await interaction.editReply(
      `🧹 Se borraron ${deleted.size} mensaje(s)${user ? ` de ${user.tag}` : ''}.`,
    );
  },
};
