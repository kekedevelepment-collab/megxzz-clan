const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Guarda o mira citas memorables del servidor.')
    .addSubcommand((sc) =>
      sc
        .setName('guardar')
        .setDescription('Guarda una cita memorable.')
        .addStringOption((o) => o.setName('texto').setDescription('La cita').setRequired(true))
        .addUserOption((o) => o.setName('autor').setDescription('Quién dijo la cita').setRequired(false)),
    )
    .addSubcommand((sc) => sc.setName('aleatoria').setDescription('Muestra una cita al azar.')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const data = db.read();
    data.quotes = data.quotes || {};
    data.quotes[interaction.guild.id] = data.quotes[interaction.guild.id] || [];

    if (sub === 'guardar') {
      const text = interaction.options.getString('texto');
      const author = interaction.options.getUser('autor');

      data.quotes[interaction.guild.id].push({
        text,
        authorId: author?.id || null,
        authorTag: author?.tag || 'Desconocido',
        savedBy: interaction.user.tag,
        date: new Date().toISOString(),
      });
      db.write(data);

      return interaction.reply(`📝 Cita guardada${author ? ` de **${author.tag}**` : ''}.`);
    }

    if (sub === 'aleatoria') {
      const quotes = data.quotes[interaction.guild.id];
      if (!quotes || quotes.length === 0) {
        return interaction.reply({ content: 'Todavía no hay citas guardadas en este servidor.', ephemeral: true });
      }

      const chosen = quotes[Math.floor(Math.random() * quotes.length)];
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setDescription(`💬 *"${chosen.text}"*`)
        .setFooter({ text: `— ${chosen.authorTag}` });

      return interaction.reply({ embeds: [embed] });
    }
  },
};
