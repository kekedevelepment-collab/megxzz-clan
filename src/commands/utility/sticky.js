const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sticky')
    .setDescription('Fija un mensaje que se repite automáticamente en el canal.')
    .addStringOption((o) => o.setName('mensaje').setDescription('Texto a fijar (dejar vacío para quitarlo)').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const content = interaction.options.getString('mensaje');
    const data = db.read();
    data.stickies = data.stickies || {};

    if (!content) {
      delete data.stickies[interaction.channel.id];
      db.write(data);
      return interaction.reply('📌 Se quitó el mensaje fijo de este canal.');
    }

    data.stickies[interaction.channel.id] = { content, lastMessageId: null };
    db.write(data);

    await interaction.reply(`📌 Mensaje fijo configurado. Se repetirá después de cada mensaje nuevo en este canal.`);
  },
};
