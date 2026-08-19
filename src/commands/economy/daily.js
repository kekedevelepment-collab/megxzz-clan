const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');
const { getUser, checkAchievements } = require('../../utils/economy');

const COOLDOWN = 24 * 3_600_000;
const AMOUNT = 200;

module.exports = {
  data: new SlashCommandBuilder().setName('daily').setDescription('Reclama una recompensa diaria.'),

  async execute(interaction) {
    const data = db.read();
    const user = getUser(data, interaction.user.id);

    const now = Date.now();
    if (now - user.lastDaily < COOLDOWN) {
      const nextClaim = Math.floor((user.lastDaily + COOLDOWN) / 1000);
      return interaction.reply({ content: `Ya reclamaste tu diaria. Volvé <t:${nextClaim}:R>.`, ephemeral: true });
    }

    user.balance += AMOUNT;
    user.lastDaily = now;
    const unlocked = checkAchievements(user);
    db.write(data);

    let reply = `💰 Reclamaste tu recompensa diaria de **${AMOUNT}** monedas. Balance: **${user.balance}** 🪙`;
    if (unlocked.length > 0) reply += `\n🏆 Logro(s) desbloqueado(s): ${unlocked.join(', ')}`;

    await interaction.reply(reply);
  },
};
