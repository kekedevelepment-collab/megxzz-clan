const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Cambia el apodo de un usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a modificar').setRequired(true))
    .addStringOption((o) =>
      o.setName('apodo').setDescription('Nuevo apodo (dejar vacío para quitarlo)').setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const nickname = interaction.options.getString('apodo') || null;
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: 'Ese usuario no está en el servidor.', ephemeral: true });
    }

    if (!member.manageable) {
      return interaction.reply({ content: 'No tengo permisos para cambiar el apodo de ese usuario.', ephemeral: true });
    }

    try {
      await member.setNickname(nickname);
      await interaction.reply(
        nickname ? `✏️ Apodo de ${user} cambiado a **${nickname}**.` : `✏️ Apodo de ${user} eliminado.`,
      );
    } catch (error) {
      await interaction.reply({ content: 'No pude cambiar el apodo de ese usuario.', ephemeral: true });
    }
  },
};
