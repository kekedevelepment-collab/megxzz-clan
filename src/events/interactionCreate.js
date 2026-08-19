const { PermissionFlagsBits, ChannelType } = require('discord.js');
const logger = require('../utils/logger');
const db = require('../utils/database');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        logger.error(`Error ejecutando /${interaction.commandName}: ${error.message}`);
        console.error(error);

        const reply = { content: 'Hubo un error al ejecutar este comando.', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply);
        } else {
          await interaction.reply(reply);
        }
      }
      return;
    }

    if (interaction.isButton() && interaction.customId === 'ticket_open') {
      const data = db.read();
      const config = data.guildConfig[interaction.guild.id] || {};

      const existing = interaction.guild.channels.cache.find(
        (c) => c.name === `ticket-${interaction.user.username}`.toLowerCase(),
      );
      if (existing) {
        return interaction.reply({ content: `Ya tenés un ticket abierto: ${existing}`, ephemeral: true });
      }

      const overwrites = [
        { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ];
      if (config.ticketStaffRoleId) {
        overwrites.push({
          id: config.ticketStaffRoleId,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        });
      }

      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: config.ticketCategoryId || null,
        permissionOverwrites: overwrites,
      });

      await channel.send(`🎫 Ticket de ${interaction.user}. Usá \`/ticket-close\` cuando termines.`);
      await interaction.reply({ content: `Ticket creado: ${channel}`, ephemeral: true });
    }
  },
};
