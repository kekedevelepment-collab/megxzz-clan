const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder().setName('editsnipe').setDescription('Recupera la última edición de un mensaje del canal.'),

  async execute(interaction) {
    const data = db.read();
    const snipe = data.editSnipes?.[interaction.channel.id];

    if (!snipe) {
      return interaction.reply({ content: 'No hay ediciones recientes en este canal.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: snipe.authorTag, iconURL: snipe.authorAvatar })
      .addFields(
        { name: 'Antes', value: snipe.before.slice(0, 1024) },
        { name: 'Después', value: snipe.after.slice(0, 1024) },
      )
      .setFooter({ text: 'Mensaje editado' })
      .setTimestamp(snipe.timestamp);

    await interaction.reply({ embeds: [embed] });
  },
};
