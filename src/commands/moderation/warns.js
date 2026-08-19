const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Muestra el historial de advertencias de un usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a consultar').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const data = db.read();
    const key = `${interaction.guild.id}-${user.id}`;
    const warns = data.warns[key] || [];

    if (warns.length === 0) {
      return interaction.reply({ content: `${user.tag} no tiene advertencias.`, ephemeral: true });
    }

    const list = warns
      .map((w, i) => `**#${i + 1}** — ${w.reason}\nPor: ${w.moderator} • ${new Date(w.date).toLocaleString('es-AR')}`)
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle(`Advertencias de ${user.tag}`)
      .setDescription(list);

    await interaction.reply({ embeds: [embed] });
  },
};
