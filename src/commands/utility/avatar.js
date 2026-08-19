const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Muestra el avatar de un usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a consultar').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const globalAvatar = user.displayAvatarURL({ size: 1024, extension: 'png' });
    const serverAvatar = member?.avatar ? member.displayAvatarURL({ size: 1024, extension: 'png' }) : null;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Avatar de ${user.tag}`)
      .setImage(serverAvatar || globalAvatar)
      .setDescription(
        serverAvatar
          ? `[Avatar global](${globalAvatar}) • [Avatar del servidor](${serverAvatar})`
          : `[Ver en tamaño completo](${globalAvatar})`,
      );

    await interaction.reply({ embeds: [embed] });
  },
};
