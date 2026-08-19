const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder().setName('snipe').setDescription('Recupera el último mensaje eliminado del canal.'),

  async execute(interaction) {
    const data = db.read();
    const snipe = data.snipes?.[interaction.channel.id];

    if (!snipe) {
      return interaction.reply({ content: 'No hay mensajes eliminados recientes en este canal.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: snipe.authorTag, iconURL: snipe.authorAvatar })
      .setDescription(snipe.content)
      .setFooter({ text: 'Mensaje eliminado' })
      .setTimestamp(snipe.timestamp);

    await interaction.reply({ embeds: [embed] });
  },
};
