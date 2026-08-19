const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('marry')
    .setDescription('Proponele matrimonio a alguien.')
    .addUserOption((o) => o.setName('usuario').setDescription('A quién le proponés matrimonio').setRequired(true)),

  async execute(interaction) {
    const proposer = interaction.user;
    const target = interaction.options.getUser('usuario');

    if (target.id === proposer.id) {
      return interaction.reply({ content: 'No podés proponerte matrimonio a vos mismo/a 😅', ephemeral: true });
    }
    if (target.bot) {
      return interaction.reply({ content: 'No podés casarte con un bot 🤖', ephemeral: true });
    }

    const data = db.read();
    data.marriages = data.marriages || {};

    if (data.marriages[proposer.id]) {
      return interaction.reply({
        content: `Ya estás casado/a con <@${data.marriages[proposer.id]}>. Usá \`/divorce\` primero si querés cambiar.`,
        ephemeral: true,
      });
    }
    if (data.marriages[target.id]) {
      return interaction.reply({ content: `**${target.username}** ya está casado/a con otra persona.`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle('💍 Propuesta de matrimonio')
      .setDescription(`${target}, **${proposer.username}** te propone matrimonio. ¿Qué decidís?\n\n*Solo ${target.username} puede responder.*`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('marry_accept').setLabel('💍 Aceptar').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('marry_reject').setLabel('💔 Rechazar').setStyle(ButtonStyle.Danger),
    );

    await interaction.reply({ content: `${target}`, embeds: [embed], components: [row] });
    const message = await interaction.fetchReply();

    let resolved = false;
    const collector = message.createMessageComponentCollector({ time: 60_000 });

    collector.on('collect', async (i) => {
      if (i.user.id !== target.id) {
        return i.reply({ content: 'Esta propuesta no es para vos.', ephemeral: true });
      }

      resolved = true;
      collector.stop();

      if (i.customId === 'marry_accept') {
        const freshData = db.read();
        freshData.marriages = freshData.marriages || {};

        if (freshData.marriages[proposer.id] || freshData.marriages[target.id]) {
          const busyEmbed = EmbedBuilder.from(embed).setDescription(
            'Uno de los dos ya se casó mientras tanto. Propuesta cancelada.',
          );
          return i.update({ content: null, embeds: [busyEmbed], components: [] });
        }

        freshData.marriages[proposer.id] = target.id;
        freshData.marriages[target.id] = proposer.id;
        db.write(freshData);

        const acceptedEmbed = EmbedBuilder.from(embed)
          .setDescription(`💕 ${target} aceptó casarse con **${proposer.username}**! Felicidades a la nueva pareja.`);
        await i.update({ content: null, embeds: [acceptedEmbed], components: [] });
      } else {
        const rejectedEmbed = EmbedBuilder.from(embed).setDescription(
          `💔 ${target} rechazó la propuesta de **${proposer.username}**.`,
        );
        await i.update({ content: null, embeds: [rejectedEmbed], components: [] });
      }
    });

    collector.on('end', () => {
      if (!resolved) {
        const expiredEmbed = EmbedBuilder.from(embed).setDescription(
          `⌛ La propuesta de **${proposer.username}** a ${target} expiró sin respuesta.`,
        );
        message.edit({ content: null, embeds: [expiredEmbed], components: [] }).catch(() => {});
      }
    });
  },
};
