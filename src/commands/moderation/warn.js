const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Aplica una advertencia a un usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a advertir').setRequired(true))
    .addStringOption((o) => o.setName('razon').setDescription('Razón de la advertencia').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon');

    const data = db.read();
    const key = `${interaction.guild.id}-${user.id}`;
    if (!data.warns[key]) data.warns[key] = [];

    data.warns[key].push({
      reason,
      moderator: interaction.user.tag,
      date: new Date().toISOString(),
    });
    db.write(data);

    const embed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle('⚠️ Advertencia aplicada')
      .addFields(
        { name: 'Usuario', value: `${user.tag}`, inline: true },
        { name: 'Moderador', value: interaction.user.tag, inline: true },
        { name: 'Razón', value: reason },
        { name: 'Total de advertencias', value: `${data.warns[key].length}` },
      );

    await interaction.reply({ embeds: [embed] });
  },
};
