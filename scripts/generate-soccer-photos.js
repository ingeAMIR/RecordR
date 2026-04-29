/**
 * Enriquece fotos de soccer via API-Football usando el endpoint /squads.
 * 1 request por equipo (~20-40 jugadores con foto cada uno).
 * Uso: node scripts/generate-soccer-photos.js TU_API_KEY
 */
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const API_KEY = process.argv[2];
if (!API_KEY) { console.error('Uso: node scripts/generate-soccer-photos.js TU_API_KEY'); process.exit(1); }

const FILE   = path.join(__dirname, '../frontend/public/data/players.json');
const SEASON = 2024;
const LEAGUES = [
  { id: 140, name: 'LaLiga',         espnLeague: 'esp.1' },
  { id: 39,  name: 'Premier League', espnLeague: 'eng.1' },
  { id: 78,  name: 'Bundesliga',     espnLeague: 'ger.1' },
  { id: 135, name: 'Serie A',        espnLeague: 'ita.1' },
  { id: 61,  name: 'Ligue 1',        espnLeague: 'fra.1' },
  { id: 262, name: 'Liga MX',        espnLeague: 'mex.1' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function get(url) {
  return new Promise(res => {
    https.get(url, { headers: { 'x-apisports-key': API_KEY, 'User-Agent': 'RecordR/1.0' } }, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => { try { res(JSON.parse(d)); } catch { res(null); } });
    }).on('error', () => res(null));
  });
}

function norm(str) {
  return (str || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '').trim();
}

// API-Football usa "K. Mbappé" — extrae apellido para matching más robusto
function lastName(name) {
  const parts = norm(name).split(' ');
  return parts[parts.length - 1];
}

async function getTeamsForLeague(leagueId) {
  const d = await get(`https://v3.football.api-sports.io/teams?league=${leagueId}&season=${SEASON}`);
  return (d?.response || []).map(r => ({ id: r.team.id, name: r.team.name }));
}

async function getSquad(teamId) {
  const d = await get(`https://v3.football.api-sports.io/players/squads?team=${teamId}`);
  return d?.response?.[0]?.players || [];
}

async function getRemainingRequests() {
  const d = await get('https://v3.football.api-sports.io/status');
  const r = d?.response?.requests;
  return r ? (r.limit_day - r.current) : 0;
}

async function main() {
  const raw = JSON.parse(fs.readFileSync(FILE));
  const all = raw.players;

  let remaining = await getRemainingRequests();
  console.log(`Requests disponibles hoy: ${remaining}/100\n`);

  let totalUpdated = 0;

  for (const league of LEAGUES) {
    if (remaining < 5) {
      console.log(`\n⚠️  Límite diario casi agotado. Vuelve a correr mañana para las ligas restantes.`);
      break;
    }

    console.log(`[${league.name}] Obteniendo equipos...`);
    const teams = await getTeamsForLeague(league.id);
    remaining--;
    console.log(`  ${teams.length} equipos encontrados`);

    // Jugadores de esta liga sin foto
    const ourPlayers = all.filter(p => p.leagueSlug === league.espnLeague && !p.photo);
    // Índice por apellido para matching rápido
    const byLastName = new Map();
    const byFullName = new Map();
    ourPlayers.forEach(p => {
      byLastName.set(lastName(p.name), p);
      byFullName.set(norm(p.name), p);
    });

    let leagueUpdated = 0;

    for (const team of teams) {
      if (remaining < 2) break;

      const squad = await getSquad(team.id);
      remaining--;
      await sleep(600);

      for (const apiPlayer of squad) {
        if (!apiPlayer.photo) continue;

        // Intentar match por nombre completo normalizado primero
        const fullMatch = byFullName.get(norm(apiPlayer.name));
        const lastMatch = byLastName.get(lastName(apiPlayer.name));
        const player    = fullMatch || lastMatch;

        if (player && !player.photo) {
          const idx = all.findIndex(p => p.id === player.id);
          if (idx !== -1) {
            all[idx].photo = apiPlayer.photo;
            player.photo   = apiPlayer.photo; // actualizar en el mapa también
            leagueUpdated++;
          }
        }
      }

      process.stdout.write('.');
    }

    fs.writeFileSync(FILE, JSON.stringify({ ...raw, players: all }));
    console.log(` [+${leagueUpdated} fotos | ${remaining} requests restantes]`);
    totalUpdated += leagueUpdated;
  }

  fs.writeFileSync(FILE, JSON.stringify({ ...raw, players: all, generated: new Date().toISOString() }));

  const withPhoto = all.filter(p => p.sport === 'soccer' && p.photo).length;
  const total     = all.filter(p => p.sport === 'soccer').length;

  console.log(`\n✓ Completado`);
  console.log(`  Fotos nuevas:    ${totalUpdated}`);
  console.log(`  Soccer con foto: ${withPhoto}/${total} (${Math.round(withPhoto / total * 100)}%)`);
  if (remaining < 5) {
    console.log(`\n⏰ Vuelve a correr mañana para completar las ligas pendientes:`);
    console.log(`   node scripts/generate-soccer-photos.js ${API_KEY}`);
  }
}

main().catch(console.error);
