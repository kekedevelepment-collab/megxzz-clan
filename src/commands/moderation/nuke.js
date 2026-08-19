const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Clona el canal actual y borra el original.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;
    const position = channel.position;

    await interaction.reply('💥 Nukeando este canal...');

    const clone = await channel.clone();
    await clone.setPosition(position);
    await channel.delete();

    await clone.send('💥 Este canal fue nukeado.');
  },
};
