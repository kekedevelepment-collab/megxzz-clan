const { SlashCommandBuilder } = require('discord.js');

function parseDuration(input) {
  const match = input.match(/^(\d+)\s*(s|m|h|d)$/i);
  if (!match) return null;
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * multipliers[unit];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Programa un recordatorio.')
    .addStringOption((o) =>
      o.setName('tiempo').setDescription('Ej: 10m, 2h, 1d, 30s').setRequired(true),
    )
    .addStringOption((o) => o.setName('mensaje').setDescription('Qué querés que te recuerde').setRequired(true)),

  async execute(interaction) {
    const durationInput = interaction.options.getString('tiempo');
    const message = interaction.options.getString('mensaje');
    const ms = parseDuration(durationInput);

    if (!ms || ms < 1000 || ms > 7 * 86_400_000) {
      return interaction.reply({
        content: 'Formato de tiempo inválido. Usá algo como `10m`, `2h`, `1d` (máximo 7 días).',
        ephemeral: true,
      });
    }

    const triggerAt = Math.floor((Date.now() + ms) / 1000);
    await interaction.reply(`⏰ Listo, te voy a recordar esto <t:${triggerAt}:R> (<t:${triggerAt}:f>).`);

    setTimeout(async () => {
      try {
        await interaction.user.send(`⏰ **Recordatorio:** ${message}`);
      } catch (error) {
        interaction.channel.send(`⏰ ${interaction.user}, recordatorio: ${message}`).catch(() => {});
      }
    }, ms);
  },
};
