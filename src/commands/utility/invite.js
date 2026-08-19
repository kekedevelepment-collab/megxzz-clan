const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('invite').setDescription('Genera un enlace de invitación al servidor.'),

  async execute(interaction) {
    try {
      const invite = await interaction.channel.createInvite({ maxAge: 86400, maxUses: 0 });
      await interaction.reply(`🔗 ${invite.url}`);
    } catch {
      await interaction.reply({
        content: 'No pude crear una invitación (revisá mis permisos de "Crear invitación").',
        ephemeral: true,
      });
    }
  },
};
