const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Envía una sugerencia para el servidor.')
    .addStringOption((o) => o.setName('sugerencia').setDescription('Tu sugerencia').setRequired(true)),

  async execute(interaction) {
    const suggestion = interaction.options.getString('sugerencia');

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('💡 Nueva sugerencia')
      .setDescription(suggestion)
      .setFooter({ text: `Sugerido por ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    const message = await interaction.fetchReply();
    await message.react('👍');
    await message.react('👎');
  },
};
