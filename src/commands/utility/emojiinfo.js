const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojiinfo')
    .setDescription('Información de un emoji.')
    .addStringOption((o) => o.setName('emoji').setDescription('Emoji personalizado del servidor').setRequired(true)),

  async execute(interaction) {
    const input = interaction.options.getString('emoji');
    const match = input.match(/<(a)?:(\w+):(\d+)>/);

    if (!match) {
      return interaction.reply({ content: 'Eso no parece un emoji personalizado válido.', ephemeral: true });
    }

    const [, animated, name, id] = match;
    const url = `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}`;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Emoji: ${name}`)
      .setThumbnail(url)
      .addFields(
        { name: 'ID', value: id, inline: true },
        { name: 'Animado', value: animated ? 'Sí' : 'No', inline: true },
        { name: 'URL', value: `[Abrir](${url})` },
      );

    await interaction.reply({ embeds: [embed] });
  },
};
