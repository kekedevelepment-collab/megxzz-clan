const { SlashCommandBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript')
    .setDescription('Genera la transcripción de un ticket.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    let allMessages = [];
    let lastId = null;

    while (true) {
      const options = { limit: 100 };
      if (lastId) options.before = lastId;

      const fetched = await interaction.channel.messages.fetch(options);
      if (fetched.size === 0) break;

      allMessages = allMessages.concat([...fetched.values()]);
      lastId = fetched.last().id;

      if (fetched.size < 100) break;
      if (allMessages.length >= 1000) break;
    }

    allMessages.reverse();

    const lines = allMessages.map((m) => {
      const time = new Date(m.createdTimestamp).toLocaleString('es-AR');
      const content = m.content || '(sin texto / adjunto o embed)';
      return `[${time}] ${m.author.tag}: ${content}`;
    });

    const header = `Transcripción de #${interaction.channel.name}\nServidor: ${interaction.guild.name}\nGenerado: ${new Date().toLocaleString('es-AR')}\n${'='.repeat(50)}\n\n`;
    const buffer = Buffer.from(header + lines.join('\n'), 'utf-8');
    const attachment = new AttachmentBuilder(buffer, { name: `transcript-${interaction.channel.name}.txt` });

    await interaction.editReply({ content: `📄 Transcripción de ${allMessages.length} mensaje(s).`, files: [attachment] });
  },
};
