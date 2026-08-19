const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Ranking de experiencia.'),

  async execute(interaction) {
    const data = db.read();
    const levels = data.levels || {};

    const ranking = Object.entries(levels)
      .filter(([key]) => key.startsWith(`${interaction.guild.id}-`))
      .map(([key, value]) => ({ userId: key.split('-').pop(), ...value }))
      .sort((a, b) => b.level - a.level || b.xp - a.xp)
      .slice(0, 10);

    if (ranking.length === 0) {
      return interaction.reply({ content: 'Todavía no hay nadie con experiencia en este servidor.', ephemeral: true });
    }

    const medals = ['🥇', '🥈', '🥉'];
    const list = ranking
      .map((entry, i) => `${medals[i] || `**${i + 1}.**`} <@${entry.userId}> — Nivel ${entry.level} (${entry.xp} XP)`)
      .join('\n');

    const embed = new EmbedBuilder().setColor(0x5865f2).setTitle('🏆 Ranking de experiencia').setDescription(list);

    await interaction.reply({ embeds: [embed] });
  },
};
