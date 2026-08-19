const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('confess')
    .setDescription('Envía un mensaje anónimo.')
    .addStringOption((o) => o.setName('mensaje').setDescription('Tu mensaje anónimo').setRequired(true))
    .addChannelOption((o) =>
      o
        .setName('canal')
        .setDescription('Canal donde publicarlo (default: canal actual)')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false),
    ),

  async execute(interaction) {
    const message = interaction.options.getString('mensaje');
    const channel = interaction.options.getChannel('canal') || interaction.channel;

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setAuthor({ name: 'Confesión anónima 🎭' })
      .setDescription(message)
      .setTimestamp();

    try {
      await channel.send({ embeds: [embed] });
      await interaction.reply({ content: '✅ Tu confesión fue enviada de forma anónima.', ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: 'No pude enviar el mensaje en ese canal.', ephemeral: true });
    }
  },
};
