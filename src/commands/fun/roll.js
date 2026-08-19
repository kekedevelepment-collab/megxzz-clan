const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchNekoGif } = require('../../utils/nekoApi');

module.exports = {
  data: new SlashCommandBuilder().setName('roll').setDescription('Lanza un dado de 6 caras.'),

  async execute(interaction) {
    const result = Math.floor(Math.random() * 6) + 1;

    await interaction.deferReply();

    let imageUrl = null;
    try {
      imageUrl = await fetchNekoGif(result === 6 ? 'happy' : result === 1 ? 'facepalm' : 'think');
    } catch (err) {
      // sin gif si falla la API
    }

    const embed = new EmbedBuilder().setColor(0x5865f2).setDescription(`🎲 Sacaste un **${result}**.`);
    if (imageUrl) embed.setImage(imageUrl);

    await interaction.editReply({ embeds: [embed] });
  },
};
