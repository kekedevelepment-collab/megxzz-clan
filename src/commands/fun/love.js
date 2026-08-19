const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchNekoGif } = require('../../utils/nekoApi');

function gifForPercent(percent) {
  if (percent >= 80) return 'kiss';
  if (percent >= 50) return 'cuddle';
  if (percent >= 20) return 'blush';
  return 'cry';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('love')
    .setDescription('Calcula el amor entre vos y otro usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const percent = Math.floor(Math.random() * 101);

    await interaction.deferReply();

    let imageUrl = null;
    try {
      imageUrl = await fetchNekoGif(gifForPercent(percent));
    } catch (err) {
      // seguimos sin imagen si la API falla
    }

    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setDescription(`💞 ${interaction.user} + ${user} = **${percent}%** de amor`);
    if (imageUrl) embed.setImage(imageUrl);

    await interaction.editReply({ embeds: [embed] });
  },
};
