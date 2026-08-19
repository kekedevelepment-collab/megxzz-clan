const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-add')
    .setDescription('Agrega a un usuario al ticket actual.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a agregar').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: 'Este comando solo se puede usar dentro de un canal de ticket.', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    await interaction.channel.permissionOverwrites.edit(user.id, {
      ViewChannel: true,
      SendMessages: true,
    });

    await interaction.reply(`✅ ${user.tag} fue agregado al ticket.`);
  },
};
