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
    .setName('ship')
    .setDescription('Une a dos usuarios aleatoriamente en una pareja.')
    .addUserOption((o) => o.setName('usuario1').setDescription('Primer usuario').setRequired(true))
    .addUserOption((o) => o.setName('usuario2').setDescription('Segundo usuario').setRequired(false)),

  async execute(interaction) {
    const user1 = interaction.options.getUser('usuario1');
    const user2 = interaction.options.getUser('usuario2') || interaction.user;
    const percent = Math.floor(Math.random() * 101);

    const name =
      user1.username.slice(0, Math.ceil(user1.username.length / 2)) +
      user2.username.slice(Math.floor(user2.username.length / 2));

    await interaction.deferReply();

    let imageUrl = null;
    try {
      imageUrl = await fetchNekoGif(gifForPercent(percent));
    } catch (err) {
      // seguimos sin imagen si la API falla
    }

    const bar = '█'.repeat(Math.round(percent / 10)) + '░'.repeat(10 - Math.round(percent / 10));

    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle(`💘 ${name}`)
      .setDescription(`${user1} + ${user2}\n\n${bar} **${percent}%**`);
    if (imageUrl) embed.setImage(imageUrl);

    await interaction.editReply({ embeds: [embed] });
  },
};
