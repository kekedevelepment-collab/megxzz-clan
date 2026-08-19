const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Inicia una votación simple con reacciones de sí/no.')
    .addStringOption((o) => o.setName('pregunta').setDescription('Pregunta de la encuesta').setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('pregunta');

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📊 Encuesta')
      .setDescription(question)
      .setFooter({ text: `Iniciada por ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });
    const message = await interaction.fetchReply();
    await message.react('✅');
    await message.react('❌');
  },
};
