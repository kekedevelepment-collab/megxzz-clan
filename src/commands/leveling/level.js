const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');

function xpForLevel(level) {
  return 5 * level * level + 50 * level + 100;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Muestra tu nivel.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a consultar').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const key = `${interaction.guild.id}-${user.id}`;
    const data = db.read();
    const levelData = data.levels?.[key] || { xp: 0, level: 0 };
    const needed = xpForLevel(levelData.level);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .addFields(
        { name: 'Nivel', value: `${levelData.level}`, inline: true },
        { name: 'XP', value: `${levelData.xp} / ${needed}`, inline: true },
      );

    await interaction.reply({ embeds: [embed] });
  },
};
