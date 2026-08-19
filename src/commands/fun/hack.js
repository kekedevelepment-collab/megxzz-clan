const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchNekoGif } = require('../../utils/nekoApi');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Realiza un hackeo falso y cómico a un amigo.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');

    await interaction.reply(`💻 Iniciando hackeo a ${user.username}...`);
    const steps = [
      'Accediendo a la cámara... 📸',
      'Descargando fotos vergonzosas... 🖼️',
      'Robando contraseñas de WiFi... 📶',
      'Hackeo completado. 100% (es broma 😄)',
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 1200));
      await interaction.followUp(step);
    }

    try {
      const imageUrl = await fetchNekoGif('smug');
      if (imageUrl) {
        const embed = new EmbedBuilder().setColor(0x5865f2).setImage(imageUrl);
        await interaction.followUp({ embeds: [embed] });
      }
    } catch (err) {
      // sin gif si falla la API
    }
  },
};
