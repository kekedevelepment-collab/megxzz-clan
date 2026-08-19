const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require('../../utils/database');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('consola')
    .setDescription('Configura el canal de logs (consola) del servidor.')
    .addSubcommand((sc) =>
      sc
        .setName('canal')
        .setDescription('Define el canal donde se van a mandar los logs.')
        .addChannelOption((o) =>
          o.setName('canal').setDescription('Canal de texto').addChannelTypes(ChannelType.GuildText).setRequired(true),
        ),
    )
    .addSubcommand((sc) => sc.setName('desactivar').setDescription('Desactiva el envío de logs en este servidor.'))
    .addSubcommand((sc) => sc.setName('ver').setDescription('Muestra el canal de logs configurado actualmente.'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const data = db.read();
    data.guildConfig = data.guildConfig || {};
    data.guildConfig[interaction.guild.id] = data.guildConfig[interaction.guild.id] || {};

    if (sub === 'canal') {
      const channel = interaction.options.getChannel('canal');
      data.guildConfig[interaction.guild.id].logChannelId = channel.id;
      db.write(data);
      return interaction.reply(`✅ A partir de ahora los logs del servidor se van a mandar a ${channel}.`);
    }

    if (sub === 'desactivar') {
      data.guildConfig[interaction.guild.id].logChannelId = 'disabled';
      db.write(data);
      return interaction.reply('🔕 Se desactivaron los logs para este servidor.');
    }

    if (sub === 'ver') {
      const configured = data.guildConfig[interaction.guild.id].logChannelId;

      if (configured === 'disabled') {
        return interaction.reply({ content: 'Los logs están desactivados en este servidor.', ephemeral: true });
      }
      if (configured) {
        return interaction.reply({ content: `El canal de logs configurado con \`/consola\` es <#${configured}>.`, ephemeral: true });
      }
      if (config.logChannelId) {
        return interaction.reply({
          content: `No configuraste ninguno con \`/consola\`, pero hay uno por defecto en el código: <#${config.logChannelId}>.`,
          ephemeral: true,
        });
      }
      return interaction.reply({ content: 'No hay ningún canal de logs configurado.', ephemeral: true });
    }
  },
};
