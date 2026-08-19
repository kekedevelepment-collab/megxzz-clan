const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbanea a un usuario por su ID.')
    .addStringOption((o) => o.setName('id').setDescription('ID del usuario a desbanear').setRequired(true))
    .addStringOption((o) => o.setName('razon').setDescription('Razón').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('id').trim();
    const reason = interaction.options.getString('razon') || 'No especificada';

    if (!/^\d{17,20}$/.test(userId)) {
      return interaction.reply({ content: 'Eso no parece un ID de usuario válido.', ephemeral: true });
    }

    try {
      const bans = await interaction.guild.bans.fetch();
      if (!bans.has(userId)) {
        return interaction.reply({ content: 'Ese usuario no está baneado.', ephemeral: true });
      }

      await interaction.guild.members.unban(userId, reason);
      await interaction.reply(`🕊️ Se desbaneó al usuario con ID \`${userId}\`. Razón: ${reason}`);
    } catch (error) {
      await interaction.reply({ content: 'No pude desbanear a ese usuario.', ephemeral: true });
    }
  },
};
