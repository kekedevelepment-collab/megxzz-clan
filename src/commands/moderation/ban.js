const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario del servidor.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a banear').setRequired(true))
    .addStringOption((o) => o.setName('razon').setDescription('Razón del baneo').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'No especificada';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      return interaction.reply({ content: 'No encontré a ese usuario en el servidor.', ephemeral: true });
    }
    if (!member.bannable) {
      return interaction.reply({ content: 'No puedo banear a este usuario (jerarquía de roles o permisos).', ephemeral: true });
    }

    await member.ban({ reason });
    await interaction.reply(`🔨 ${user.tag} fue baneado. Razón: ${reason}`);
  },
};
