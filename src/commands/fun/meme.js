const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const MEMES_FALLBACK = [
  'Cuando el profe dice "va a entrar en el examen" y era mentira.',
  'Yo revisando el celular cada 5 segundos esperando una notificación que nunca llega.',
  'Mi cuenta bancaria después de un mes.',
  'Cuando decís "ya lo hago" y pasan 3 días.',
  'El WiFi cortándose justo en el momento importante.',
];

module.exports = {
  data: new SlashCommandBuilder().setName('meme').setDescription('Muestra un meme al azar.'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const res = await fetch('https://meme-api.com/gimme');
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();

      if (data?.url && !data.nsfw) {
        const embed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle(data.title?.slice(0, 256) || 'Meme')
          .setImage(data.url)
          .setFooter({ text: `r/${data.subreddit} • 👍 ${data.ups ?? '?'}` });

        return interaction.editReply({ embeds: [embed] });
      }
    } catch (err) {
      // si falla la API, seguimos con el fallback
    }

    const meme = MEMES_FALLBACK[Math.floor(Math.random() * MEMES_FALLBACK.length)];
    const embed = new EmbedBuilder().setColor(0x5865f2).setDescription(meme);
    await interaction.editReply({ embeds: [embed] });
  },
};
