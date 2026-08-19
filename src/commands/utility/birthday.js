const { SlashCommandBuilder } = require('discord.js');
const db = require('../../utils/database');

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Guarda tu cumpleaños.')
    .addIntegerOption((o) => o.setName('dia').setDescription('Día (1-31)').setRequired(true))
    .addIntegerOption((o) => o.setName('mes').setDescription('Mes (1-12)').setRequired(true)),

  async execute(interaction) {
    const day = interaction.options.getInteger('dia');
    const month = interaction.options.getInteger('mes');

    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return interaction.reply({ content: 'Ingresá una fecha válida.', ephemeral: true });
    }

    const key = `${interaction.guild.id}-${interaction.user.id}`;
    const data = db.read();
    data.birthdays = data.birthdays || {};
    data.birthdays[key] = { day, month, userId: interaction.user.id };
    db.write(data);

    await interaction.reply(`🎂 Guardé tu cumpleaños: **${day} de ${MONTHS[month - 1]}**.`);
  },
};
