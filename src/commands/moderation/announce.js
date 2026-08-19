const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Envía un anuncio en formato Embed.')
    .addStringOption((o) => o.setName('titulo').setDescription('Título del anuncio').setRequired(true))
    .addStringOption((o) => o.setName('mensaje').setDescription('Contenido del anuncio').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const title = interaction.options.getString('titulo');
    const message = interaction.options.getString('mensaje');

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`📢 ${title}`)
      .setDescription(message)
      .setFooter({ text: `Anunciado por ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Anuncio enviado.', ephemeral: true });
  },
};
