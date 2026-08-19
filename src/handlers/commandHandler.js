const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');
const logger = require('../utils/logger');

function loadCommands(client) {
  client.commands = new Collection();
  const commandsPath = path.join(__dirname, '..', 'commands');
  const categories = fs.readdirSync(commandsPath);

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const commandFiles = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(categoryPath, file);
      try {
        const command = require(filePath);

        if (!command.data || !command.execute) {
          logger.fail(`${file} no tiene "data" o "execute"`);
          continue;
        }

        client.commands.set(command.data.name, command);
        logger.success(`Comando /${command.data.name} cargado`);
      } catch (error) {
        logger.fail(`Error cargando ${file}: ${error.message}`);
      }
    }
  }
}

module.exports = { loadCommands };
