const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('servericon').setDescription('Muestra la foto del servidor.'),

  async execute(interaction) {
    const icon = interaction.guild.iconURL({ size: 1024 });
    if (!icon) return interaction.reply({ content: 'Este servidor no tiene ícono.', ephemeral: true });

    const embed = new EmbedBuilder().setColor(0x5865f2).setTitle(interaction.guild.name).setImage(icon);
    await interaction.reply({ embeds: [embed] });
  },
};
