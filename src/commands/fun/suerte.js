const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchNekoGif } = require('../../utils/nekoApi');

module.exports = {
  data: new SlashCommandBuilder().setName('suerte').setDescription('Te dice tu nivel de suerte para el día de hoy.'),

  async execute(interaction) {
    const percent = Math.floor(Math.random() * 101);

    await interaction.deferReply();

    let imageUrl = null;
    try {
      imageUrl = await fetchNekoGif(percent >= 60 ? 'happy' : percent <= 25 ? 'cry' : 'think');
    } catch (err) {
      // sin gif si falla la API
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setDescription(`🍀 ${interaction.user}, tu nivel de suerte hoy es: **${percent}%**`);
    if (imageUrl) embed.setImage(imageUrl);

    await interaction.editReply({ embeds: [embed] });
  },
};
