const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('membercount').setDescription('Muestra el número total de miembros.'),

  async execute(interaction) {
    await interaction.reply(`👥 Este servidor tiene **${interaction.guild.memberCount}** miembros.`);
  },
};
