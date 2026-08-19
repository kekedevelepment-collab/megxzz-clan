const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('countdown')
    .setDescription('Cuenta regresiva para un evento.')
    .addStringOption((o) => o.setName('evento').setDescription('Nombre del evento').setRequired(true))
    .addStringOption((o) => o.setName('fecha').setDescription('Fecha y hora (formato: AAAA-MM-DD HH:MM)').setRequired(true)),

  async execute(interaction) {
    const eventName = interaction.options.getString('evento');
    const dateInput = interaction.options.getString('fecha');

    const target = new Date(dateInput.replace(' ', 'T'));
    if (Number.isNaN(target.getTime())) {
      return interaction.reply({
        content: 'Fecha inválida. Usá el formato `AAAA-MM-DD HH:MM` (ej: 2026-12-31 23:59).',
        ephemeral: true,
      });
    }

    const timestamp = Math.floor(target.getTime() / 1000);
    if (timestamp <= Math.floor(Date.now() / 1000)) {
      return interaction.reply({ content: 'Esa fecha ya pasó.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`⏳ Cuenta regresiva: ${eventName}`)
      .setDescription(`**${eventName}** es <t:${timestamp}:R>\n📅 <t:${timestamp}:F>`);

    await interaction.reply({ embeds: [embed] });
  },
};
