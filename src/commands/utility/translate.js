const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Traduce un texto.')
    .addStringOption((o) => o.setName('texto').setDescription('Texto a traducir').setRequired(true))
    .addStringOption((o) =>
      o.setName('destino').setDescription('Idioma destino (ej: en, es, pt, fr)').setRequired(true),
    )
    .addStringOption((o) =>
      o.setName('origen').setDescription('Idioma de origen (default: autodetectar)').setRequired(false),
    ),

  async execute(interaction) {
    const text = interaction.options.getString('texto');
    const target = interaction.options.getString('destino').toLowerCase();
    const source = (interaction.options.getString('origen') || 'auto').toLowerCase();

    await interaction.deferReply();

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MegxzzzClanBot/1.0)' },
      });

      if (!res.ok) {
        return interaction.editReply('No pude traducir ese texto. Revisá los códigos de idioma (ej: en, es, pt, fr).');
      }

      const data = await res.json();
      const translated = data?.[0]?.map((segment) => segment[0]).join('') || null;
      const detectedSource = data?.[2] || source;

      if (!translated) {
        return interaction.editReply('No pude traducir ese texto. Revisá los códigos de idioma (ej: en, es, pt, fr).');
      }

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle('🌐 Traducción')
        .addFields(
          { name: `Original (${detectedSource})`, value: text.slice(0, 1024) },
          { name: `Traducido (${target})`, value: translated.slice(0, 1024) },
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply('Hubo un error al conectar con el servicio de traducción.');
    }
  },
};
