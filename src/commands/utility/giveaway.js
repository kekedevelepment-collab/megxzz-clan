const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require('discord.js');

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
    .setName('giveaway')
    .setDescription('Crea un sorteo.')
    .addStringOption((o) => o.setName('premio').setDescription('Qué se sortea').setRequired(true))
    .addStringOption((o) => o.setName('duracion').setDescription('Ej: 30s, 10m, 1h, 1d').setRequired(true))
    .addIntegerOption((o) => o.setName('ganadores').setDescription('Cantidad de ganadores (default 1)').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const prize = interaction.options.getString('premio');
    const durationInput = interaction.options.getString('duracion');
    const winnersCount = interaction.options.getInteger('ganadores') || 1;
    const ms = parseDuration(durationInput);

    if (!ms || ms < 5000 || ms > 7 * 86_400_000) {
      return interaction.reply({
        content: 'Duración inválida. Usá algo como `30s`, `10m`, `1h`, `1d` (máximo 7 días).',
        ephemeral: true,
      });
    }

    const endsAt = Math.floor((Date.now() + ms) / 1000);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🎉 ¡Sorteo!')
      .setDescription(`**Premio:** ${prize}\n**Termina:** <t:${endsAt}:R>\n**Ganadores:** ${winnersCount}\n\nApretá el botón para participar.`)
      .setFooter({ text: `Organizado por ${interaction.user.tag}` });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('giveaway_join').setLabel('🎉 Participar').setStyle(ButtonStyle.Primary),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
    const giveawayMessage = await interaction.fetchReply();

    const participants = new Set();
    const collector = giveawayMessage.createMessageComponentCollector({ time: ms });

    collector.on('collect', async (i) => {
      if (i.customId !== 'giveaway_join') return;
      if (participants.has(i.user.id)) {
        return i.reply({ content: 'Ya estás participando en este sorteo.', ephemeral: true });
      }
      participants.add(i.user.id);
      await i.reply({ content: '✅ ¡Estás participando!', ephemeral: true });
    });

    collector.on('end', async () => {
      const pool = [...participants];

      if (pool.length === 0) {
        const noWinnersEmbed = EmbedBuilder.from(embed).setDescription(`**Premio:** ${prize}\n\n❌ Nadie participó en el sorteo.`);
        return giveawayMessage.edit({ embeds: [noWinnersEmbed], components: [] }).catch(() => {});
      }

      const winners = [];
      const shuffled = pool.sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(winnersCount, shuffled.length); i++) {
        winners.push(shuffled[i]);
      }

      const winnersText = winners.map((id) => `<@${id}>`).join(', ');
      const finishedEmbed = EmbedBuilder.from(embed).setDescription(
        `**Premio:** ${prize}\n\n🏆 Ganador(es): ${winnersText}`,
      );

      await giveawayMessage.edit({ embeds: [finishedEmbed], components: [] }).catch(() => {});
      await giveawayMessage.reply(`🎉 ¡Felicitaciones ${winnersText}! Ganaste **${prize}**.`).catch(() => {});
    });
  },
};
