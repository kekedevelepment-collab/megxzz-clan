const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Muestra la lista de comandos disponibles.'),

  async execute(interaction) {
    const commands = interaction.client.commands;
    const list = [...commands.values()]
      .map((c) => `**/${c.data.name}** — ${c.data.description}`)
      .sort()
      .join('\n');

    const embed = new EmbedBuilder().setColor(0x5865f2).setTitle('📜 Lista de comandos — S.U.U').setDescription(list);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
