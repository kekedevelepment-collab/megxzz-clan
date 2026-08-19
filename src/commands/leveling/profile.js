const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');

function xpForLevel(level) {
  return 5 * level * level + 50 * level + 100;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Perfil personalizado del usuario.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a consultar').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const key = `${interaction.guild.id}-${user.id}`;

    const data = db.read();
    const levelData = data.levels?.[key] || { xp: 0, level: 0 };
    const economyData = data.economy?.[user.id] || { balance: 0, inventory: [], achievements: [] };
    const needed = xpForLevel(levelData.level);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'Nivel', value: `${levelData.level}`, inline: true },
        { name: 'XP', value: `${levelData.xp} / ${needed}`, inline: true },
        { name: 'Monedas', value: `${economyData.balance} 🪙`, inline: true },
        { name: 'Objetos en inventario', value: `${economyData.inventory.length}`, inline: true },
        { name: 'Logros', value: `${economyData.achievements.length}`, inline: true },
      );

    await interaction.reply({ embeds: [embed] });
  },
};
