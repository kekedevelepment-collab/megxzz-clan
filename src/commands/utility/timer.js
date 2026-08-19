const { SlashCommandBuilder } = require('discord.js');

function parseDuration(input) {
  const match = input.match(/^(\d+)\s*(s|m|h)$/i);
  if (!match) return null;
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000 };
  return value * multipliers[unit];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Crea un temporizador.')
    .addStringOption((o) => o.setName('duracion').setDescription('Ej: 30s, 5m, 1h').setRequired(true)),

  async execute(interaction) {
    const durationInput = interaction.options.getString('duracion');
    const ms = parseDuration(durationInput);

    if (!ms || ms < 1000 || ms > 3_600_000) {
      return interaction.reply({
        content: 'Formato inválido. Usá algo como `30s`, `5m`, `1h` (máximo 1 hora).',
        ephemeral: true,
      });
    }

    const endsAt = Math.floor((Date.now() + ms) / 1000);
    await interaction.reply(`⏱️ Temporizador iniciado. Termina <t:${endsAt}:R>.`);

    setTimeout(() => {
      interaction.followUp(`⏱️ ${interaction.user}, ¡se terminó tu temporizador de **${durationInput}**!`).catch(() => {});
    }, ms);
  },
};
