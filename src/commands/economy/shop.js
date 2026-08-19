const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');
const { SHOP_ITEMS, getUser, checkAchievements } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Tienda del servidor.')
    .addSubcommand((sc) => sc.setName('ver').setDescription('Muestra los objetos disponibles.'))
    .addSubcommand((sc) =>
      sc
        .setName('comprar')
        .setDescription('Compra un objeto de la tienda.')
        .addStringOption((o) =>
          o
            .setName('objeto')
            .setDescription('Objeto a comprar')
            .setRequired(true)
            .addChoices(...SHOP_ITEMS.map((i) => ({ name: `${i.name} — ${i.price} 🪙`, value: i.id }))),
        ),
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'ver') {
      const list = SHOP_ITEMS.map((i) => `${i.name} — **${i.price}** 🪙`).join('\n');
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle('🛒 Tienda del servidor')
        .setDescription(list)
        .setFooter({ text: 'Usá /shop comprar para adquirir un objeto.' });

      return interaction.reply({ embeds: [embed] });
    }

    if (sub === 'comprar') {
      const itemId = interaction.options.getString('objeto');
      const item = SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item) return interaction.reply({ content: 'Ese objeto no existe.', ephemeral: true });

      const data = db.read();
      const user = getUser(data, interaction.user.id);

      if (user.balance < item.price) {
        return interaction.reply({ content: `No te alcanza. Te faltan **${item.price - user.balance}** monedas.`, ephemeral: true });
      }

      user.balance -= item.price;
      user.inventory.push(item.id);
      const unlocked = checkAchievements(user);
      db.write(data);

      let reply = `✅ Compraste **${item.name}** por **${item.price}** 🪙. Balance restante: **${user.balance}** 🪙`;
      if (unlocked.length > 0) reply += `\n🏆 Logro(s) desbloqueado(s): ${unlocked.join(', ')}`;

      await interaction.reply(reply);
    }
  },
};
