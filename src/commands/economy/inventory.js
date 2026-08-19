const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');
const { SHOP_ITEMS, getUser } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Inventario de objetos.')
    .addUserOption((o) => o.setName('usuario').setDescription('Usuario a consultar').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getUser('usuario') || interaction.user;
    const data = db.read();
    const user = getUser(data, target.id);
    db.write(data);

    if (user.inventory.length === 0) {
      return interaction.reply({ content: `${target.id === interaction.user.id ? 'No tenés' : `${target.tag} no tiene`} objetos todavía. Usá \`/shop\` para comprar.`, ephemeral: target.id === interaction.user.id });
    }

    const counts = {};
    for (const itemId of user.inventory) counts[itemId] = (counts[itemId] || 0) + 1;

    const list = Object.entries(counts)
      .map(([id, count]) => {
        const item = SHOP_ITEMS.find((i) => i.id === id);
        return `${item ? item.name : id} x${count}`;
      })
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
      .setTitle('🎒 Inventario')
      .setDescription(list);

    await interaction.reply({ embeds: [embed] });
  },
};
