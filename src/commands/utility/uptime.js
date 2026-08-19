const { SlashCommandBuilder } = require('discord.js');

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

module.exports = {
  data: new SlashCommandBuilder().setName('uptime').setDescription('Muestra hace cuánto está encendido el bot.'),

  async execute(interaction) {
    const uptime = formatDuration(interaction.client.uptime);
    await interaction.reply(`⏳ Llevo encendido: **${uptime}**`);
  },
};
