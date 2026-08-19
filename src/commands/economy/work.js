const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');
const { getUser, checkAchievements } = require('../../utils/economy');

const COOLDOWN = 3_600_000;
const JOBS = [
  'programando un bot', 'entregando pizzas', 'paseando perros', 'vendiendo memes',
  'moderando el server', 'arreglando bugs', 'streameando', 'lavando autos',
];

module.exports = {
  data: new SlashCommandBuilder().setName('work').setDescription('Gana monedas trabajando.'),

  async execute(interaction) {
    const data = db.read();
    const user = getUser(data, interaction.user.id);

    const now = Date.now();
    if (now - user.lastWork < COOLDOWN) {
      const nextWork = Math.floor((user.lastWork + COOLDOWN) / 1000);
      return interaction.reply({ content: `Ya trabajaste hace poco. Podés volver a trabajar <t:${nextWork}:R>.`, ephemeral: true });
    }

    const earned = Math.floor(Math.random() * 80) + 20;
    const job = JOBS[Math.floor(Math.random() * JOBS.length)];

    user.balance += earned;
    user.lastWork = now;
    user.workCount = (user.workCount || 0) + 1;
    const unlocked = checkAchievements(user);
    db.write(data);

    let reply = `💼 Trabajaste ${job} y ganaste **${earned}** monedas. Balance: **${user.balance}** 🪙`;
    if (unlocked.length > 0) reply += `\n🏆 Logro(s) desbloqueado(s): ${unlocked.join(', ')}`;

    await interaction.reply(reply);
  },
};
