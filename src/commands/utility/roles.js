const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('roles').setDescription('Muestra los roles del servidor.'),

  async execute(interaction) {
    const roles =
      interaction.guild.roles.cache
        .filter((r) => r.id !== interaction.guild.id)
        .sort((a, b) => b.position - a.position)
        .map((r) => `${r}`)
        .join('\n') || 'No hay roles.';

    const embed = new EmbedBuilder().setColor(0x5865f2).setTitle('Roles del servidor').setDescription(roles);
    await interaction.reply({ embeds: [embed] });
  },
};
