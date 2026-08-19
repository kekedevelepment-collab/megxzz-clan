const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Envía un mensaje a través del bot.')
    .addStringOption((o) => o.setName('mensaje').setDescription('Texto a enviar').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const message = interaction.options.getString('mensaje');
    await interaction.channel.send(message);
    await interaction.reply({ content: 'Mensaje enviado.', ephemeral: true });
  },
};
