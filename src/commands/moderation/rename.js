const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Cambia el nombre del canal actual.')
    .addStringOption((o) => o.setName('nombre').setDescription('Nuevo nombre').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const name = interaction.options.getString('nombre');
    await interaction.channel.setName(name);
    await interaction.reply(`✏️ Canal renombrado a **${name}**.`);
  },
};
