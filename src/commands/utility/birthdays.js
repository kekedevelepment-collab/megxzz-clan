const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../utils/database');

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

module.exports = {
  data: new SlashCommandBuilder().setName('birthdays').setDescription('Lista de próximos cumpleaños.'),

  async execute(interaction) {
    const data = db.read();
    const birthdays = data.birthdays || {};

    const guildBirthdays = Object.entries(birthdays)
      .filter(([key]) => key.startsWith(`${interaction.guild.id}-`))
      .map(([, value]) => value);

    if (guildBirthdays.length === 0) {
      return interaction.reply({ content: 'Nadie guardó su cumpleaños todavía. Usá `/birthday` para agregar el tuyo.', ephemeral: true });
    }

    const today = new Date();
    const todayKey = (today.getMonth() + 1) * 100 + today.getDate();

    guildBirthdays.sort((a, b) => {
      const aKey = (a.month * 100 + a.day - todayKey + 1300) % 1300;
      const bKey = (b.month * 100 + b.day - todayKey + 1300) % 1300;
      return aKey - bKey;
    });

    const list = guildBirthdays
      .slice(0, 15)
      .map((b) => `• <@${b.userId}> — ${b.day} de ${MONTHS[b.month - 1]}`)
      .join('\n');

    const embed = new EmbedBuilder().setColor(0x5865f2).setTitle('🎂 Próximos cumpleaños').setDescription(list);

    await interaction.reply({ embeds: [embed] });
  },
};
