const levels = {
  info: '\x1b[36mℹ\x1b[0m',
  success: '✅',
  fail: '❌',
  warn: '⚠️',
  error: '\x1b[31m[ERROR]\x1b[0m',
  event: '\x1b[35m📡\x1b[0m',
};

function log(level, message) {
  const time = new Date().toLocaleTimeString('es-AR');
  console.log(`[${time}] ${levels[level]} ${message}`);
}

module.exports = {
  info: (msg) => log('info', msg),
  success: (msg) => log('success', msg),
  fail: (msg) => log('fail', msg),
  warn: (msg) => log('warn', msg),
  error: (msg) => log('error', msg),
  // event(): para el log en vivo de todo lo que pasa en el servidor
  // (mensajes editados/borrados, miembros que entran/salen, bans, roles, canales, etc).
  event: (msg) => log('event', msg),
};
