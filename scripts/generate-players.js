/**
 * Genera /frontend/public/data/players.json
 * Ejecutar: node scripts/generate-players.js
 */
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const OUT = path.join(__dirname, '../frontend/public/data/players.json');

const LEAGUES = [
  { sport:'soccer', espnSport:'soccer', espnLeague:'esp.1', leagueName:'LaLiga',         sportLabel:'Fútbol' },
  { sport:'soccer', espnSport:'soccer', espnLeague:'eng.1', leagueName:'Premier League', sportLabel:'Fútbol' },
  { sport:'soccer', espnSport:'soccer', espnLeague:'ger.1', leagueName:'Bundesliga',      sportLabel:'Fútbol' },
  { sport:'soccer', espnSport:'soccer', espnLeague:'ita.1', leagueName:'Serie A',         sportLabel:'Fútbol' },
  { sport:'soccer', espnSport:'soccer', espnLeague:'fra.1', leagueName:'Ligue 1',         sportLabel:'Fútbol' },
  { sport:'soccer', espnSport:'soccer', espnLeague:'mex.1', leagueName:'Liga MX',         sportLabel:'Fútbol' },
  { sport:'basketball', espnSport:'basketball', espnLeague:'nba', leagueName:'NBA', sportLabel:'NBA' },
  { sport:'football',   espnSport:'football',   espnLeague:'nfl', leagueName:'NFL', sportLabel:'NFL' },
  { sport:'baseball',   espnSport:'baseball',   espnLeague:'mlb', leagueName:'MLB', sportLabel:'MLB' },
];

const POS_MAP = {
  soccer:     { 'Goalkeeper':'Portero','Defender':'Defensa','Midfielder':'Mediocampista','Forward':'Delantero','Attacker':'Delantero','G':'Portero','D':'Defensa','M':'Mediocampista','F':'Delantero' },
  basketball: { 'Point Guard':'Base','PG':'Base','Shooting Guard':'Escolta','SG':'Escolta','Small Forward':'Alero','SF':'Alero','Power Forward':'Ala-Pívot','PF':'Ala-Pívot','Center':'Pívot','C':'Pívot','Guard':'Escolta','Forward':'Alero' },
  football:   { 'Quarterback':'QB','QB':'QB','Running Back':'RB','RB':'RB','Fullback':'RB','FB':'RB','Wide Receiver':'WR','WR':'WR','Tight End':'TE','TE':'TE','Offensive Tackle':'OL','OT':'OL','Offensive Guard':'OL','OG':'OL','G':'OL','T':'OL','Center':'OL','C':'OL','Defensive Tackle':'DL','DT':'DL','Defensive End':'DL','DE':'DL','NT':'DL','Linebacker':'LB','LB':'LB','ILB':'LB','OLB':'LB','MLB':'LB','Cornerback':'DB','CB':'DB','Safety':'DB','S':'DB','SS':'DB','FS':'DB','DB':'DB','Kicker':'K/P','K':'K/P','Punter':'K/P','P':'K/P','Long Snapper':'K/P','LS':'K/P' },
  baseball:   { 'Starting Pitcher':'Lanzador','SP':'Lanzador','Relief Pitcher':'Lanzador','RP':'Lanzador','Closing Pitcher':'Lanzador','CP':'Lanzador','Catcher':'Receptor','C':'Receptor','First Base':'Cuadro','1B':'Cuadro','Second Base':'Cuadro','2B':'Cuadro','Third Base':'Cuadro','3B':'Cuadro','Shortstop':'Cuadro','SS':'Cuadro','Left Field':'Outfield','LF':'Outfield','Center Field':'Outfield','CF':'Outfield','Right Field':'Outfield','RF':'Outfield','OF':'Outfield','Designated Hitter':'DH','DH':'DH' },
};

function get(url) {
  return new Promise((resolve) => {
    https.get(url, { headers:{ 'User-Agent':'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

// Ejecuta promesas en lotes de N concurrentes
async function batch(items, fn, concurrency = 5) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const r = await Promise.all(chunk.map(fn));
    results.push(...r);
    process.stdout.write('.');
  }
  return results;
}

function apiBase(cfg) {
  if (cfg.sport === 'soccer') return `https://site.api.espn.com/apis/site/v2/sports/soccer/${cfg.espnLeague}`;
  return `https://site.api.espn.com/apis/site/v2/sports/${cfg.espnSport}/${cfg.espnLeague}`;
}

function posGroup(display, abbrev, sport) {
  const map = POS_MAP[sport] || {};
  return map[display] || map[abbrev] || display || abbrev || '';
}

async function getTeams(cfg) {
  const data = await get(`${apiBase(cfg)}/teams?limit=40`);
  const raw = data?.sports?.[0]?.leagues?.[0]?.teams ?? data?.teams ?? [];
  return raw.map(e => {
    const t = e.team ?? e;
    return { id: String(t.id ?? ''), name: t.displayName ?? '', color: '#' + (t.color ?? '333333'), logo: t.logos?.[0]?.href ?? '' };
  }).filter(t => t.id && t.name);
}

async function getRoster(cfg, team) {
  const data = await get(`${apiBase(cfg)}/teams/${team.id}/roster`);
  if (!data?.athletes) return [];
  const flat = data.athletes.flatMap(e => Array.isArray(e.items) ? e.items : [e]);
  return flat.filter(a => a.id && a.displayName).map(a => {
    const posDisplay = a.position?.displayName ?? '';
    const posAbbrev  = a.position?.abbreviation ?? posDisplay;
    return {
      id:            String(a.id),
      name:          a.displayName ?? '',
      shortName:     a.shortName ?? '',
      jersey:        a.jersey ?? '?',
      position:      posAbbrev || posGroup(posDisplay, posAbbrev, cfg.sport),
      positionGroup: posGroup(posDisplay, posAbbrev, cfg.sport),
      age:           a.age ?? 0,
      nationality:   a.citizenship ?? a.birthPlace?.country ?? '',
      team:          team.name,
      teamId:        team.id,
      teamLogo:      team.logo,
      teamColor:     team.color,
      league:        cfg.leagueName,
      leagueSlug:    cfg.espnLeague,
      sport:         cfg.sport,
      sportLabel:    cfg.sportLabel,
      photo:         a.headshot?.href ?? '',   // vacío para soccer
      espnUrl:       a.links?.find(l => l.rel?.includes('playercard') || l.rel?.includes('athlete'))?.href ?? '',
      stats:         {},
      isTrending:    a.profiled === true,
    };
  });
}

async function enrichPhotos(players) {
  const soccer = players.filter(p => p.sport === 'soccer' && !p.photo);
  console.log(`\nEnriqueciendo ${soccer.length} fotos de soccer via TheSportsDB...`);
  await batch(soccer, async (player) => {
    const data = await get(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(player.name)}`);
    const r = data?.player?.[0];
    if (r) player.photo = r.strCutout || r.strThumb || '';
  }, 5);
}

async function main() {
  const allPlayers = [];

  for (const cfg of LEAGUES) {
    process.stdout.write(`\n[${cfg.leagueName}] equipos...`);
    const teams = await getTeams(cfg);
    console.log(` ${teams.length} equipos`);

    process.stdout.write(`[${cfg.leagueName}] rosters`);
    const rosters = await batch(teams, t => getRoster(cfg, t), 5);
    const players = rosters.flat().filter(p => p.name);
    allPlayers.push(...players);
    console.log(` → ${players.length} jugadores`);
  }

  await enrichPhotos(allPlayers);

  const out = { generated: new Date().toISOString(), total: allPlayers.length, players: allPlayers };
  fs.writeFileSync(OUT, JSON.stringify(out));
  console.log(`\n✓ Guardado en ${OUT}`);
  console.log(`  Total jugadores: ${allPlayers.length}`);
  const withPhoto = allPlayers.filter(p => p.photo).length;
  console.log(`  Con foto: ${withPhoto} (${Math.round(withPhoto/allPlayers.length*100)}%)`);
}

main().catch(console.error);
