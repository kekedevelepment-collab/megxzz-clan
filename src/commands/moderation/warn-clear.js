const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn-clear')
    .setDescription('Limpia todo el historial de advertencias de un usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const data = db.read();
    const key = `${interaction.guild.id}-${user.id}`;
    const count = (data.warns[key] || []).length;
    data.warns[key] = [];
    db.write(data);

    await interaction.reply(`Se eliminaron ${count} advertencia(s) de ${user.tag}.`);
  },
};
