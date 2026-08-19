const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchNekoGif } = require('../../utils/nekoApi');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('iq')
    .setDescription('Mide el IQ de un usuario de forma aleatoria.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const iq = Math.floor(Math.random() * 180) + 20;

    await interaction.deferReply();

    let endpoint = 'think';
    if (iq >= 130) endpoint = 'smug';
    else if (iq <= 60) endpoint = 'facepalm';

    let imageUrl = null;
    try {
      imageUrl = await fetchNekoGif(endpoint);
    } catch (err) {
      // sin gif si falla la API
    }

    const embed = new EmbedBuilder().setColor(0x5865f2).setDescription(`🧠 El IQ de ${user} es: **${iq}**`);
    if (imageUrl) embed.setImage(imageUrl);

    await interaction.editReply({ embeds: [embed] });
  },
};
