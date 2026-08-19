const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Marca al usuario como AFK.')
    .addStringOption((o) => o.setName('razon').setDescription('Razón del AFK').setRequired(false)),

  async execute(interaction) {
    const reason = interaction.options.getString('razon') || 'Sin razón especificada';
    const key = `${interaction.guild.id}-${interaction.user.id}`;

    const data = db.read();
    data.afk = data.afk || {};
    data.afk[key] = { reason, since: Date.now() };
    db.write(data);

    await interaction.reply(`💤 Te marqué como AFK: ${reason}`);
  },
};
