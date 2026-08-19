const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Crea un mensaje embed simple.')
    .addStringOption((o) => o.setName('titulo').setDescription('Título').setRequired(true))
    .addStringOption((o) => o.setName('descripcion').setDescription('Contenido').setRequired(true))
    .addStringOption((o) => o.setName('color').setDescription('Color hex, ej: #5865F2').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const title = interaction.options.getString('titulo');
    const description = interaction.options.getString('descripcion');
    const colorInput = interaction.options.getString('color');

    let color = 0x5865f2;
    if (colorInput && /^#?[0-9A-Fa-f]{6}$/.test(colorInput)) {
      color = parseInt(colorInput.replace('#', ''), 16);
    }

    const embed = new EmbedBuilder().setColor(color).setTitle(title).setDescription(description);

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Embed enviado.', ephemeral: true });
  },
};
