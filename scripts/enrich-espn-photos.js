/**
 * Enriquece fotos de soccer usando headshots de ESPN (por ID exacto de jugador).
 * No requiere API key. Uso: node scripts/enrich-espn-photos.js
 */
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const FILE = path.join(__dirname, '../frontend/public/data/players.json');
const LEAGUES = [
  { name: 'LaLiga',         slug: 'esp.1' },
  { name: 'Premier League', slug: 'eng.1' },
  { name: 'Bundesliga',     slug: 'ger.1' },
  { name: 'Serie A',        slug: 'ita.1' },
  { name: 'Ligue 1',        slug: 'fra.1' },
  { name: 'Liga MX',        slug: 'mex.1' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function get(url) {
  return new Promise(res => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => { try { res(JSON.parse(d)); } catch { res(null); } });
    }).on('error', () => res(null));
  });
}

async function getTeams(slug) {
  const d = await get(`https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/teams?limit=40`);
  const raw = d?.sports?.[0]?.leagues?.[0]?.teams ?? d?.teams ?? [];
  return raw.map(e => {
    const t = e.team ?? e;
    return String(t.id ?? '');
  }).filter(Boolean);
}

async function getRosterHeadshots(slug, teamId) {
  const d = await get(`https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/teams/${teamId}/roster`);
  const flat = (d?.athletes ?? []).flatMap(g => Array.isArray(g.items) ? g.items : [g]);
  const result = {};
  flat.forEach(a => {
    if (a.id && a.headshot?.href) result[String(a.id)] = a.headshot.href;
  });
  return result;
}

async function main() {
  const raw = JSON.parse(fs.readFileSync(FILE));
  const all = raw.players;

  const byId = new Map(all.map((p, i) => [String(p.id), i]));

  let totalUpdated = 0;

  for (const league of LEAGUES) {
    process.stdout.write(`[${league.name}] `);
    const teams = await getTeams(league.slug);
    process.stdout.write(`${teams.length} equipos`);

    let leagueUpdated = 0;

    for (const teamId of teams) {
      const headshots = await getRosterHeadshots(league.slug, teamId);
      await sleep(200);

      for (const [espnId, photoUrl] of Object.entries(headshots)) {
        const idx = byId.get(espnId);
        if (idx !== undefined && !all[idx].photo) {
          all[idx].photo = photoUrl;
          leagueUpdated++;
        }
      }
      process.stdout.write('.');
    }

    console.log(` → +${leagueUpdated} fotos`);
    totalUpdated += leagueUpdated;

    fs.writeFileSync(FILE, JSON.stringify({ ...raw, players: all }));
  }

  fs.writeFileSync(FILE, JSON.stringify({ ...raw, players: all, generated: new Date().toISOString() }));

  const withPhoto = all.filter(p => p.sport === 'soccer' && p.photo).length;
  const total     = all.filter(p => p.sport === 'soccer').length;

  console.log(`\n✓ Completado`);
  console.log(`  Fotos nuevas:    ${totalUpdated}`);
  console.log(`  Soccer con foto: ${withPhoto}/${total} (${Math.round(withPhoto / total * 100)}%)`);
}

main().catch(console.error);
