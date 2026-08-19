const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('id')
    .setDescription('Muestra la ID de un usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    await interaction.reply(`🆔 ID de ${user.tag}: \`${user.id}\``);
  },
};
