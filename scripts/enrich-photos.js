/**
 * Enriquece fotos de soccer usando Wikipedia API (sin rate limits).
 * Ejecutar: node scripts/enrich-photos.js
 */
const https   = require('https');
const fs      = require('fs');
const path    = require('path');

const FILE       = path.join(__dirname, '../frontend/public/data/players.json');
const DELAY_MS   = 400;   // secuencial con pausa — Wikipedia funciona así
const SAVE_EVERY = 100;

function get(url) {
  return new Promise(res => {
    https.get(url, { headers: { 'User-Agent': 'RecordR/1.0' } }, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => { try { res(JSON.parse(d)); } catch { res(null); } });
    }).on('error', () => res(null));
  });
}

async function getWikiPhoto(name) {
  // Paso 1: buscar artículo de Wikipedia
  const searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search'
    + '&srsearch=' + encodeURIComponent(name + ' footballer')
    + '&format=json&origin=*&srlimit=1';
  const search = await get(searchUrl);
  const page   = search?.query?.search?.[0];
  if (!page) return '';

  // Paso 2: obtener imagen del artículo
  const imgUrl = 'https://en.wikipedia.org/w/api.php?action=query'
    + '&titles=' + encodeURIComponent(page.title)
    + '&prop=pageimages&pithumbsize=300&format=json&origin=*';
  const img    = await get(imgUrl);
  const pages  = img?.query?.pages || {};
  const first  = Object.values(pages)[0];
  return first?.thumbnail?.source || '';
}

async function main() {
  const raw  = JSON.parse(fs.readFileSync(FILE));
  const all  = raw.players;
  const todo = all.filter(p => p.sport === 'soccer' && !p.photo);

  console.log(`Soccer sin foto: ${todo.length}`);
  console.log(`Modo:            secuencial (400ms entre requests)`);
  console.log(`Tiempo aprox:    ~${Math.round(todo.length * DELAY_MS / 60000)} minutos\n`);

  let enriched = 0;
  let notFound = 0;

  for (let i = 0; i < todo.length; i++) {
    const player = todo[i];
    const photo  = await getWikiPhoto(player.name);
    const idx    = all.findIndex(p => p.id === player.id);

    if (idx !== -1 && photo) {
      all[idx].photo = photo;
      enriched++;
      process.stdout.write('✓');
    } else {
      notFound++;
      process.stdout.write('.');
    }

    if ((i + 1) % SAVE_EVERY === 0) {
      fs.writeFileSync(FILE, JSON.stringify({ ...raw, players: all }));
      const pct = Math.round((i + 1) / todo.length * 100);
      process.stdout.write(` [${i+1}/${todo.length} ${pct}% | +${enriched} fotos]\n`);
    }

    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  fs.writeFileSync(FILE, JSON.stringify({ ...raw, players: all, generated: new Date().toISOString() }));

  const total = all.filter(p => p.photo).length;
  console.log(`\n✓ Completado`);
  console.log(`  Fotos nuevas:   ${enriched}`);
  console.log(`  Sin artículo:   ${notFound}`);
  console.log(`  Total con foto: ${total}/${all.length} (${Math.round(total/all.length*100)}%)`);
}

main().catch(console.error);
