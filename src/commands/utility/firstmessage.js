const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('firstmessage')
    .setDescription('Muestra el primer mensaje de un canal.')
    .addChannelOption((o) => o.setName('canal').setDescription('Canal a consultar').setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('canal') || interaction.channel;

    if (!channel.isTextBased()) {
      return interaction.reply({ content: 'Ese canal no es de texto.', ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const messages = await channel.messages.fetch({ after: '0', limit: 1 });
      const firstMessage = messages.first();

      if (!firstMessage) {
        return interaction.editReply('No pude encontrar el primer mensaje de ese canal.');
      }

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setAuthor({ name: firstMessage.author.tag, iconURL: firstMessage.author.displayAvatarURL() })
        .setDescription(firstMessage.content || '*(mensaje sin texto)*')
        .addFields({ name: 'Enlace', value: `[Ir al mensaje](${firstMessage.url})` })
        .setTimestamp(firstMessage.createdTimestamp);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply('No pude obtener el primer mensaje de ese canal.');
    }
  },
};
