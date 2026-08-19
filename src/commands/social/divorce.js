const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder().setName('divorce').setDescription('Te divorciás de tu pareja actual.'),

  async execute(interaction) {
    const data = db.read();
    const partnerId = data.marriages?.[interaction.user.id];

    if (!partnerId) {
      return interaction.reply({ content: 'No estás casado/a con nadie.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0xff6961)
      .setDescription(`¿Estás seguro/a de que querés divorciarte de <@${partnerId}>?\n\n*Solo vos podés confirmar esto.*`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('divorce_confirm').setLabel('💔 Confirmar divorcio').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('divorce_cancel').setLabel('Cancelar').setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
    const message = await interaction.fetchReply();

    let resolved = false;
    const collector = message.createMessageComponentCollector({ time: 30_000 });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: 'Este botón no es para vos.', ephemeral: true });
      }

      resolved = true;
      collector.stop();

      if (i.customId === 'divorce_confirm') {
        const freshData = db.read();
        freshData.marriages = freshData.marriages || {};
        delete freshData.marriages[interaction.user.id];
        delete freshData.marriages[partnerId];
        db.write(freshData);

        await i.update({ content: `💔 Te divorciaste de <@${partnerId}>.`, embeds: [], components: [] });
      } else {
        await i.update({ content: 'Divorcio cancelado.', embeds: [], components: [] });
      }
    });

    collector.on('end', () => {
      if (!resolved) {
        message.edit({ content: 'No respondiste a tiempo, se canceló el divorcio.', embeds: [], components: [] }).catch(() => {});
      }
    });
  },
};
