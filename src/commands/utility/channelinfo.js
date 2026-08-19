const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

const typeNames = {
  [ChannelType.GuildText]: 'Texto',
  [ChannelType.GuildVoice]: 'Voz',
  [ChannelType.GuildCategory]: 'Categoría',
  [ChannelType.GuildAnnouncement]: 'Anuncios',
  [ChannelType.GuildStageVoice]: 'Escenario',
  [ChannelType.GuildForum]: 'Foro',
  [ChannelType.PublicThread]: 'Hilo público',
  [ChannelType.PrivateThread]: 'Hilo privado',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channelinfo')
    .setDescription('Información de un canal.')
    .addChannelOption((o) => o.setName('canal').setDescription('Canal a consultar').setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('canal') || interaction.channel;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Canal: ${channel.name}`)
      .addFields(
        { name: 'ID', value: channel.id, inline: true },
        { name: 'Tipo', value: typeNames[channel.type] || 'Desconocido', inline: true },
        { name: 'Categoría', value: channel.parent ? channel.parent.name : 'Ninguna', inline: true },
        { name: 'Creado', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>` },
      );

    if ('topic' in channel && channel.topic) {
      embed.addFields({ name: 'Tema', value: channel.topic });
    }
    if ('nsfw' in channel) {
      embed.addFields({ name: 'NSFW', value: channel.nsfw ? 'Sí' : 'No', inline: true });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
