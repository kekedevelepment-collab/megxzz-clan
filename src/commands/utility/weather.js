const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const weatherCodes = {
  0: 'Despejado ☀️',
  1: 'Mayormente despejado 🌤️',
  2: 'Parcialmente nublado ⛅',
  3: 'Nublado ☁️',
  45: 'Niebla 🌫️',
  48: 'Niebla con escarcha 🌫️',
  51: 'Llovizna leve 🌦️',
  53: 'Llovizna moderada 🌦️',
  55: 'Llovizna intensa 🌧️',
  61: 'Lluvia leve 🌧️',
  63: 'Lluvia moderada 🌧️',
  65: 'Lluvia intensa 🌧️',
  71: 'Nevada leve 🌨️',
  73: 'Nevada moderada 🌨️',
  75: 'Nevada intensa ❄️',
  80: 'Chubascos 🌦️',
  95: 'Tormenta eléctrica ⛈️',
  99: 'Tormenta con granizo ⛈️',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Consulta el clima de una ciudad.')
    .addStringOption((o) => o.setName('ciudad').setDescription('Nombre de la ciudad').setRequired(true)),

  async execute(interaction) {
    const city = interaction.options.getString('ciudad');
    await interaction.deferReply();

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es`,
      );
      const geoData = await geoRes.json();
      const place = geoData?.results?.[0];

      if (!place) {
        return interaction.editReply(`No encontré la ciudad **${city}**.`);
      }

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`,
      );
      const weatherData = await weatherRes.json();
      const current = weatherData?.current;

      if (!current) {
        return interaction.editReply('No pude obtener el clima para esa ciudad.');
      }

      const description = weatherCodes[current.weather_code] || 'Desconocido';
      const location = [place.name, place.admin1, place.country].filter(Boolean).join(', ');

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(`Clima en ${location}`)
        .addFields(
          { name: 'Estado', value: description, inline: true },
          { name: 'Temperatura', value: `${current.temperature_2m}°C`, inline: true },
          { name: 'Humedad', value: `${current.relative_humidity_2m}%`, inline: true },
          { name: 'Viento', value: `${current.wind_speed_10m} km/h`, inline: true },
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply('Hubo un error al consultar el clima.');
    }
  },
};
