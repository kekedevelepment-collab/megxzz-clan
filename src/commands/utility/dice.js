const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Lanza un dado.')
    .addIntegerOption((o) => o.setName('caras').setDescription('Cantidad de caras del dado (default 6)').setRequired(false)),

  async execute(interaction) {
    const sides = interaction.options.getInteger('caras') || 6;
    if (sides < 2 || sides > 1000) {
      return interaction.reply({ content: 'El dado debe tener entre 2 y 1000 caras.', ephemeral: true });
    }
    const result = Math.floor(Math.random() * sides) + 1;
    await interaction.reply(`🎲 Tiraste un dado de ${sides} caras y salió... **${result}**`);
  },
};
