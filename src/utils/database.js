const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'data', 'db.json');

function ensureFile() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify(
        {
          warns: {},
          guildConfig: {},
          afk: {},
          snipes: {},
          editSnipes: {},
          stickies: {},
          levels: {},
          economy: {},
          birthdays: {},
          quotes: {},
          marriages: {},
          caseCounters: {},
        },
        null,
        2,
      ),
    );
  }
}

function read() {
  ensureFile();
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function write(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { read, write };
