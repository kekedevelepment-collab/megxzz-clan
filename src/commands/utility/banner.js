const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Muestra el banner de un usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a consultar').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const fetched = await interaction.client.users.fetch(user.id, { force: true });

    if (!fetched.banner) {
      return interaction.reply({ content: `**${user.tag}** no tiene banner.`, ephemeral: true });
    }

    const bannerUrl = fetched.bannerURL({ size: 1024, extension: 'png' });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Banner de ${user.tag}`)
      .setImage(bannerUrl);

    await interaction.reply({ embeds: [embed] });
  },
};
