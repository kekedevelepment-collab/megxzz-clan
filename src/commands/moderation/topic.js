const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('topic')
    .setDescription('Cambia el tema/descripción del canal actual.')
    .addStringOption((o) => o.setName('texto').setDescription('Nuevo tema').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const topic = interaction.options.getString('texto');
    await interaction.channel.setTopic(topic);
    await interaction.reply('📝 Tema del canal actualizado.');
  },
};
