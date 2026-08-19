const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');
const { ACHIEVEMENTS, getUser } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('achievement')
    .setDescription('Logros desbloqueados.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a consultar').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getUser('usuario') || interaction.user;
    const data = db.read();
    const user = getUser(data, target.id);
    db.write(data);

    const list = ACHIEVEMENTS.map((a) => `${user.achievements.includes(a.id) ? '✅' : '🔒'} ${a.name}`).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
      .setTitle('🏆 Logros')
      .setDescription(list)
      .setFooter({ text: `${user.achievements.length}/${ACHIEVEMENTS.length} desbloqueados` });

    await interaction.reply({ embeds: [embed] });
  },
};
