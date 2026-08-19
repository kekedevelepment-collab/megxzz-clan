const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('randommember').setDescription('Elige un miembro al azar.'),

  async execute(interaction) {
    await interaction.guild.members.fetch();
    const members = interaction.guild.members.cache.filter((m) => !m.user.bot);
    const chosen = members.random();

    if (!chosen) {
      return interaction.reply({ content: 'No hay miembros para elegir.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🎲 Miembro al azar')
      .setThumbnail(chosen.displayAvatarURL())
      .setDescription(`${chosen}`);

    await interaction.reply({ embeds: [embed] });
  },
};
