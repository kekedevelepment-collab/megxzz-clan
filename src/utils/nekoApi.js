// Helper compartido para pedir gifs/imágenes SFW a la API de nekos.best.
// Usado por /interact y por los comandos de la carpeta fun/ que llevan gif.

async function fetchNekoGif(endpoint) {
  const res = await fetch(`https://nekos.best/api/v2/${endpoint}`, {
    headers: {
      // La API exige un User-Agent identificable, si no lo mandás puede
      // devolver error y el gif no aparece.
      'User-Agent': 'MegxzzzClanBot/1.0 (https://github.com/Megxzzz-Clan)',
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`nekos.best respondió ${res.status} para /${endpoint}`);
  }

  const data = await res.json();
  return data?.results?.[0]?.url || null;
}

module.exports = { fetchNekoGif };
