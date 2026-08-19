const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Información de un rol.')
    .addRoleOption((o) => o.setName('rol').setDescription('Rol a consultar').setRequired(true)),

  async execute(interaction) {
    const role = interaction.options.getRole('rol');

    const embed = new EmbedBuilder()
      .setColor(role.color || 0x5865f2)
      .setTitle(`Rol: ${role.name}`)
      .addFields(
        { name: 'ID', value: role.id, inline: true },
        { name: 'Color', value: role.hexColor, inline: true },
        { name: 'Posición', value: `${role.position}`, inline: true },
        { name: 'Miembros', value: `${role.members.size}`, inline: true },
        { name: 'Mencionable', value: role.mentionable ? 'Sí' : 'No', inline: true },
        { name: 'Se muestra aparte', value: role.hoist ? 'Sí' : 'No', inline: true },
        { name: 'Creado', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>` },
      );

    await interaction.reply({ embeds: [embed] });
  },
};
