const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { fetchNekoGif } = require('../../utils/nekoApi');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sorteo')
    .setDescription('Envía un sorteo rápido con reacción.')
    .addStringOption((o) => o.setName('premio').setDescription('Qué se sortea').setRequired(true))
    .addIntegerOption((o) => o.setName('minutos').setDescription('Duración en minutos').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const prize = interaction.options.getString('premio');
    const minutes = interaction.options.getInteger('minutos');

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('🎉 Sorteo')
      .setDescription(
        `Premio: **${prize}**\nReaccioná con 🎉 para participar.\nTermina: <t:${Math.floor(
          (Date.now() + minutes * 60000) / 1000,
        )}:R>`,
      );

    await interaction.reply({ embeds: [embed] });
    const message = await interaction.fetchReply();
    await message.react('🎉');

    setTimeout(async () => {
      try {
        const fetched = await message.fetch();
        const reaction = fetched.reactions.cache.get('🎉');
        const users = reaction ? await reaction.users.fetch() : new Map();
        const participants = users.filter((u) => !u.bot);

        if (participants.size === 0) {
          return message.reply('El sorteo terminó, pero nadie participó.');
        }

        const winner = participants.random();

        let imageUrl = null;
        try {
          imageUrl = await fetchNekoGif('happy');
        } catch (err) {
          // sin gif si falla la API
        }

        const winnerEmbed = new EmbedBuilder()
          .setColor(0xf1c40f)
          .setDescription(`🎉 ¡Felicidades ${winner}! Ganaste: **${prize}**`);
        if (imageUrl) winnerEmbed.setImage(imageUrl);

        await message.reply({ embeds: [winnerEmbed] });
      } catch (error) {
        console.error(error);
      }
    }, minutes * 60000);
  },
};
