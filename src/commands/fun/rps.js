const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchNekoGif } = require('../../utils/nekoApi');

const OPTIONS = ['piedra', 'papel', 'tijera'];
const BEATS = { piedra: 'tijera', papel: 'piedra', tijera: 'papel' };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Jugá piedra, papel o tijera contra el bot.')
    .addStringOption((o) =>
      o
        .setName('eleccion')
        .setDescription('Tu elección')
        .setRequired(true)
        .addChoices(
          { name: 'Piedra', value: 'piedra' },
          { name: 'Papel', value: 'papel' },
          { name: 'Tijera', value: 'tijera' },
        ),
    ),

  async execute(interaction) {
    const userChoice = interaction.options.getString('eleccion');
    const botChoice = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];

    let result;
    let endpoint;
    if (userChoice === botChoice) {
      result = 'Empate.';
      endpoint = 'shrug';
    } else if (BEATS[userChoice] === botChoice) {
      result = '¡Ganaste!';
      endpoint = 'happy';
    } else {
      result = 'Perdiste.';
      endpoint = 'facepalm';
    }

    await interaction.deferReply();

    let imageUrl = null;
    try {
      imageUrl = await fetchNekoGif(endpoint);
    } catch (err) {
      // sin gif si falla la API
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setDescription(`Elegiste **${userChoice}**, el bot eligió **${botChoice}**. ${result}`);
    if (imageUrl) embed.setImage(imageUrl);

    await interaction.editReply({ embeds: [embed] });
  },
};
