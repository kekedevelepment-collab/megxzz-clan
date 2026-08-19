const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Elige una opción entre varias.')
    .addStringOption((o) =>
      o.setName('opciones').setDescription('Opciones separadas por coma (ej: pizza, sushi, tacos)').setRequired(true),
    ),

  async execute(interaction) {
    const raw = interaction.options.getString('opciones');
    const options = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (options.length < 2) {
      return interaction.reply({ content: 'Necesito al menos 2 opciones separadas por coma.', ephemeral: true });
    }

    const choice = options[Math.floor(Math.random() * options.length)];

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setDescription(`🤔 Entre ${options.map((o) => `\`${o}\``).join(', ')}...\n\n🎯 Elijo: **${choice}**`);

    await interaction.reply({ embeds: [embed] });
  },
};
