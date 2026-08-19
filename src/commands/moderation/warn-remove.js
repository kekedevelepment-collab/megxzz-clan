const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn-remove')
    .setDescription('Remueve una advertencia específica de un usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addIntegerOption((o) => o.setName('numero').setDescription('Número de advertencia (ver con /warns)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const index = interaction.options.getInteger('numero') - 1;

    const data = db.read();
    const key = `${interaction.guild.id}-${user.id}`;
    const warns = data.warns[key] || [];

    if (!warns[index]) {
      return interaction.reply({ content: 'No existe una advertencia con ese número.', ephemeral: true });
    }

    const [removed] = warns.splice(index, 1);
    db.write(data);

    await interaction.reply(`Se eliminó la advertencia: "${removed.reason}" de ${user.tag}.`);
  },
};
