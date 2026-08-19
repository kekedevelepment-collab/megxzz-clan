const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Muestra detalles de un usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a consultar').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(user.tag)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Cuenta creada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        {
          name: 'Se unió al servidor',
          value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Desconocido',
          inline: true,
        },
        {
          name: 'Roles',
          value: member
            ? member.roles.cache.filter((r) => r.id !== interaction.guild.id).map((r) => r).join(' ') || 'Ninguno'
            : 'Desconocido',
        },
      );

    await interaction.reply({ embeds: [embed] });
  },
};
