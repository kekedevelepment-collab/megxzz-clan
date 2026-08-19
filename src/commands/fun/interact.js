const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const logger = require('../../utils/logger');
const { fetchNekoGif } = require('../../utils/nekoApi');

const ACTIONS = {
  kiss: { endpoint: 'kiss', verbo: 'besó' },
  hug: { endpoint: 'hug', verbo: 'abrazó' },
  pat: { endpoint: 'pat', verbo: 'acarició la cabeza a' },
  slap: { endpoint: 'slap', verbo: 'le pegó una cachetada a' },
  cuddle: { endpoint: 'cuddle', verbo: 'se acurrucó con' },
  poke: { endpoint: 'poke', verbo: 'le tocó el hombro a' },
  tickle: { endpoint: 'tickle', verbo: 'le hizo cosquillas a' },
  feed: { endpoint: 'feed', verbo: 'le dio de comer a' },
  bite: { endpoint: 'bite', verbo: 'mordió a' },
  blush: { endpoint: 'blush', verbo: 'se sonrojó por' },
  dance: { endpoint: 'dance', verbo: 'bailó con' },
  highfive: { endpoint: 'highfive', verbo: 'chocó los cinco con' },
  wave: { endpoint: 'wave', verbo: 'saludó a' },
  wink: { endpoint: 'wink', verbo: 'le guiñó el ojo a' },
  cry: { endpoint: 'cry', verbo: 'lloró por' },
  punch: { endpoint: 'punch', verbo: 'le pegó un puñetazo a' },
  yeet: { endpoint: 'yeet', verbo: 'le pegó una piña voladora a' },
  nom: { endpoint: 'nom', verbo: 'se comió a' },
  handhold: { endpoint: 'handhold', verbo: 'le agarró la mano a' },
  baka: { endpoint: 'baka', verbo: 'le dijo baka a' },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('interact')
    .setDescription('Interactuá con alguien (kiss, hug, pat, slap, etc).')
    .addStringOption((o) =>
      o
        .setName('accion')
        .setDescription('Qué querés hacer')
        .setRequired(true)
        .addChoices(...Object.keys(ACTIONS).map((key) => ({ name: key, value: key }))),
    )
    .addUserOption((o) => o.setName('usuario').setDescription('A quién va dirigido').setRequired(false)),

  async execute(interaction) {
    const actionKey = interaction.options.getString('accion');
    const target = interaction.options.getUser('usuario');
    const action = ACTIONS[actionKey];

    await interaction.deferReply();

    let imageUrl = null;
    try {
      imageUrl = await fetchNekoGif(action.endpoint);
    } catch (err) {
      logger.fail(`No se pudo obtener el gif de /${action.endpoint}: ${err.message}`);
    }

    const baseDesc = target
      ? `**${interaction.user.username}** ${action.verbo} a **${target.username}** ${target.id === interaction.user.id ? '(a sí mismo/a 👀)' : ''}`
      : `**${interaction.user.username}** ${action.verbo} al aire ✨`;

    const embed = new EmbedBuilder().setColor(0x5865f2).setDescription(baseDesc);
    if (imageUrl) {
      embed.setImage(imageUrl);
    } else {
      embed.setFooter({ text: 'No se pudo cargar el gif esta vez, pero la acción se registró igual.' });
    }

    // Solo agregamos botones si hay alguien mencionado y no es la misma persona.
    const canRespond = target && target.id !== interaction.user.id && !target.bot;

    if (!canRespond) {
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('interact_reciprocate').setLabel('💌 Corresponder').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('interact_reject').setLabel('🚫 Rechazar').setStyle(ButtonStyle.Danger),
    );

    await interaction.editReply({ embeds: [embed], components: [row] });
    const message = await interaction.fetchReply();

    let resolved = false;
    const collector = message.createMessageComponentCollector({ time: 45_000 });

    collector.on('collect', async (i) => {
      // Solo puede tocar los botones el usuario que fue mencionado en el comando.
      if (i.user.id !== target.id) {
        return i.reply({ content: 'Estos botones no son para vos, son para la persona mencionada.', ephemeral: true });
      }

      resolved = true;
      collector.stop();

      if (i.customId === 'interact_reciprocate') {
        const finalEmbed = EmbedBuilder.from(embed).setDescription(
          `${baseDesc}\n\n💞 ¡y **${target.username}** le correspondió!`,
        );
        await i.update({ embeds: [finalEmbed], components: [] });
      } else {
        const finalEmbed = EmbedBuilder.from(embed).setDescription(
          `${baseDesc}\n\n😢 pero **${target.username}** lo rechazó.`,
        );
        await i.update({ embeds: [finalEmbed], components: [] });
      }
    });

    collector.on('end', () => {
      if (!resolved) {
        const finalEmbed = EmbedBuilder.from(embed).setDescription(`${baseDesc}\n\n⌛ ${target.username} no respondió a tiempo.`);
        message.edit({ embeds: [finalEmbed], components: [] }).catch(() => {});
      }
    });
  },
};
