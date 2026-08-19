const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Envía un mensaje privado a un usuario mediante el bot.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption((o) => o.setName('mensaje').setDescription('Texto a enviar').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const message = interaction.options.getString('mensaje');

    try {
      await user.send(message);
      await interaction.reply({ content: `Mensaje enviado a ${user.tag}.`, ephemeral: true });
    } catch {
      await interaction.reply({
        content: `No pude enviarle un DM a ${user.tag} (puede tener los DMs cerrados).`,
        ephemeral: true,
      });
    }
  },
};
