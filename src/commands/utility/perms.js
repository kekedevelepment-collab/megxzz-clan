const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('perms').setDescription('Muestra tus permisos en el canal actual.'),

  async execute(interaction) {
    const perms = interaction.channel.permissionsFor(interaction.member).toArray();
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Tus permisos en #${interaction.channel.name}`)
      .setDescription(perms.map((p) => `\`${p}\``).join(', ') || 'Ninguno');

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
