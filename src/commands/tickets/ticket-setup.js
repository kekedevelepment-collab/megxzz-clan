const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Lanza el panel de tickets de soporte.')
    .addStringOption((o) => o.setName('titulo').setDescription('Título del panel').setRequired(false))
    .addStringOption((o) => o.setName('descripcion').setDescription('Descripción del panel').setRequired(false))
    .addChannelOption((o) =>
      o
        .setName('categoria')
        .setDescription('Categoría donde se crearán los tickets')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(false),
    )
    .addRoleOption((o) => o.setName('rol_staff').setDescription('Rol que puede ver los tickets').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const title = interaction.options.getString('titulo') || '🎫 Soporte';
    const description =
      interaction.options.getString('descripcion') || 'Hacé clic en el botón para abrir un ticket de soporte.';
    const category = interaction.options.getChannel('categoria');
    const staffRole = interaction.options.getRole('rol_staff');

    const data = db.read();
    if (!data.guildConfig[interaction.guild.id]) data.guildConfig[interaction.guild.id] = {};
    data.guildConfig[interaction.guild.id].ticketCategoryId = category?.id || null;
    data.guildConfig[interaction.guild.id].ticketStaffRoleId = staffRole?.id || null;
    db.write(data);

    const embed = new EmbedBuilder().setColor(0x5865f2).setTitle(title).setDescription(description);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_open').setLabel('Abrir Ticket').setEmoji('🎫').setStyle(ButtonStyle.Primary),
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Panel de tickets publicado.', ephemeral: true });
  },
};
