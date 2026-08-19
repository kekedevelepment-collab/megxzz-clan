const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');
const { getUser } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Consulta tus monedas.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a consultar').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getUser('usuario') || interaction.user;
    const data = db.read();
    const user = getUser(data, target.id);
    db.write(data);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
      .setDescription(`🪙 Balance: **${user.balance}** monedas`);

    await interaction.reply({ embeds: [embed] });
  },
};
