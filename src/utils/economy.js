const SHOP_ITEMS = [
  { id: 'medalla', name: '🏅 Medalla', price: 100 },
  { id: 'corona', name: '👑 Corona', price: 500 },
  { id: 'diamante', name: '💎 Diamante', price: 1000 },
  { id: 'cofre', name: '🎁 Cofre misterioso', price: 250 },
  { id: 'espada', name: '⚔️ Espada', price: 350 },
];

const ACHIEVEMENTS = [
  { id: 'primer_paso', name: '🌱 Primer paso', check: (u) => u.balance > 0 },
  { id: 'trabajador', name: '💼 Trabajador constante', check: (u) => (u.workCount || 0) >= 10 },
  { id: 'comprador', name: '🛍️ Comprador', check: (u) => (u.inventory || []).length >= 1 },
  { id: 'coleccionista', name: '📦 Coleccionista', check: (u) => (u.inventory || []).length >= 5 },
  { id: 'rico', name: '💰 Rico', check: (u) => u.balance >= 1000 },
];

function getUser(data, userId) {
  data.economy = data.economy || {};
  if (!data.economy[userId]) {
    data.economy[userId] = { balance: 0, lastDaily: 0, lastWork: 0, workCount: 0, inventory: [], achievements: [] };
  }
  return data.economy[userId];
}

/** Revisa logros y devuelve los que se acaban de desbloquear. */
function checkAchievements(userData) {
  const unlocked = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!userData.achievements.includes(achievement.id) && achievement.check(userData)) {
      userData.achievements.push(achievement.id);
      unlocked.push(achievement.name);
    }
  }
  return unlocked;
}

module.exports = { SHOP_ITEMS, ACHIEVEMENTS, getUser, checkAchievements };
