const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchNekoGif } = require('../../utils/nekoApi');

const FRASES = [
  'lo lanzó al vacío sin paracaídas',
  'lo convirtió en polvo cósmico',
  'lo envió a otra dimensión',
  'lo eliminó con un click',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kill')
    .setDescription('Elimina cómicamente a alguien del chat.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const frase = FRASES[Math.floor(Math.random() * FRASES.length)];

    await interaction.deferReply();

    let imageUrl = null;
    try {
      imageUrl = await fetchNekoGif('kick');
    } catch (err) {
      // seguimos sin imagen si la API falla
    }

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setDescription(`💀 ${interaction.user} ${frase} a ${user}.`);
    if (imageUrl) embed.setImage(imageUrl);

    await interaction.editReply({ embeds: [embed] });
  },
};
