const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Quita el silencio a un usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) return interaction.reply({ content: 'No encontré a ese usuario.', ephemeral: true });
    if (!member.isCommunicationDisabled()) {
      return interaction.reply({ content: `${user.tag} no está silenciado.`, ephemeral: true });
    }

    await member.timeout(null);
    await interaction.reply(`🔊 Se le quitó el silencio a ${user.tag}.`);
  },
};
