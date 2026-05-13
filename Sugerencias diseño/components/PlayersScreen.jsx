/* global React */
const { useState: useStatePlayers } = React;

const PLAYERS = [
  { name:'Vinícius Júnior', short:'Vini Jr.', team:'Real Madrid', league:'LaLiga', pos:'FWD', n:'BR', age:25, jersey:7, c1:'#fff', c2:'#cfd5e6', rating:4.7, votes:8412, fav:true },
  { name:'Erling Haaland',  short:'Haaland',  team:'Manchester City', league:'Premier', pos:'FWD', n:'NO', age:25, jersey:9, c1:'#6cabdd', c2:'#1f5f8a', rating:4.6, votes:7124 },
  { name:'Luka Dončić', short:'Dončić', team:'LA Lakers', league:'NBA', pos:'PG', n:'SI', age:27, jersey:77, c1:'#552583', c2:'#3a194c', rating:4.9, votes:9844, fav:true },
  { name:'Kylian Mbappé', short:'Mbappé', team:'Real Madrid', league:'LaLiga', pos:'FWD', n:'FR', age:27, jersey:10, c1:'#fff', c2:'#cfd5e6', rating:4.5, votes:6912 },
  { name:'Nikola Jokić', short:'Jokić', team:'Denver Nuggets', league:'NBA', pos:'C', n:'SR', age:30, jersey:15, c1:'#0e2240', c2:'#040b1a', rating:4.8, votes:7322 },
  { name:'Jude Bellingham', short:'Bellingham', team:'Real Madrid', league:'LaLiga', pos:'MID', n:'EN', age:23, jersey:5, c1:'#fff', c2:'#cfd5e6', rating:4.4, votes:5188 },
  { name:'Lamine Yamal', short:'Yamal', team:'Barcelona', league:'LaLiga', pos:'FWD', n:'ES', age:18, jersey:19, c1:'#a50044', c2:'#004d98', rating:4.7, votes:4012 },
  { name:'Jayson Tatum', short:'Tatum', team:'Boston Celtics', league:'NBA', pos:'SF', n:'US', age:28, jersey:0, c1:'#007a33', c2:'#004d20', rating:4.5, votes:6244 },
  { name:'Pedri', short:'Pedri', team:'Barcelona', league:'LaLiga', pos:'MID', n:'ES', age:23, jersey:8, c1:'#a50044', c2:'#004d98', rating:4.3, votes:3521 },
  { name:'Bukayo Saka', short:'Saka', team:'Arsenal', league:'Premier', pos:'FWD', n:'EN', age:24, jersey:7, c1:'#ef0107', c2:'#990006', rating:4.4, votes:4988 },
  { name:'Stephen Curry', short:'Curry', team:'Golden State', league:'NBA', pos:'PG', n:'US', age:38, jersey:30, c1:'#1d428a', c2:'#0a1f4a', rating:4.8, votes:9112 },
  { name:'Mohamed Salah', short:'Salah', team:'Liverpool', league:'Premier', pos:'FWD', n:'EG', age:33, jersey:11, c1:'#c8102e', c2:'#7a0a1c', rating:4.5, votes:6322 },
];

const POS_COLORS = {
  FWD:'#ff6b6b', MID:'#74b9ff', DEF:'#fdcb6e',
  PG:'#a29bfe', C:'#00b894', SF:'#e84393', SG:'#00cec9',
};

const PlayersScreen = () => {
  const [active, setActive] = useStatePlayers('all');
  const [pos, setPos] = useStatePlayers('all');
  const [search, setSearch] = useStatePlayers('');

  const filtered = PLAYERS.filter(p => {
    if (active !== 'all' && p.league !== active) return false;
    if (pos !== 'all' && p.pos !== pos) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="screen scrollarea" style={{ width: 1280, height: 1700, overflowY: 'auto' }}>
      <Navbar active="players" />
      <Ticker />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px 24px' }}>
        <div className="eyebrow"><span className="dot green"/> &nbsp;ESPN · DATOS EN VIVO · TEMP. 25/26</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
          <h1 className="font-display" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', margin: 0 }}>Jugadores</h1>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>3,418 jugadores · 42 ligas</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}>
              <SearchIcon size={14}/>
            </span>
            <input className="field" placeholder="Buscar jugador..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}/>
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--line)' }}/>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              {k:'all',label:'Todas las ligas'},
              {k:'LaLiga',label:'LaLiga'},
              {k:'Premier',label:'Premier'},
              {k:'NBA',label:'NBA'},
            ].map(l => (
              <button key={l.k} onClick={() => setActive(l.k)} className={`chip ${active===l.k?'active':''}`} style={{ cursor: 'pointer', fontFamily: 'inherit' }}>
                {l.label}
              </button>
            ))}
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--line)' }}/>
          <div style={{ display: 'flex', gap: 4 }}>
            {['all','FWD','MID','DEF','PG','C'].map(p => (
              <button key={p} onClick={() => setPos(p)} className={`chip ${pos===p?'active':''}`} style={{ cursor: 'pointer', fontFamily: 'inherit' }}>
                {p === 'all' ? 'Todas pos.' : p}
              </button>
            ))}
          </div>
          <span className="mono" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-3)' }}>
            {filtered.length} resultados
          </span>
        </div>
      </div>

      {/* Grid */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
          {filtered.map((p,i)=>(
            <div key={i} className="row-hover" style={{ background: 'var(--bg)', padding: 24, position: 'relative', cursor: 'pointer' }}>
              {/* Top bar — team color */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: p.c1 }}/>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em' }}>#{p.jersey}</span>
                <span className="mono" style={{ fontSize: 9, color: POS_COLORS[p.pos] || 'var(--text-3)', letterSpacing: '0.1em', padding: '2px 6px', border: `1px solid ${POS_COLORS[p.pos] || 'var(--line-2)'}40`, borderRadius: 3 }}>{p.pos}</span>
              </div>

              {/* Photo */}
              <div className="ph-img" style={{ width: 96, height: 96, borderRadius: 999, marginBottom: 16, position: 'relative' }}>
                <span>FOTO</span>
                {p.fav && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 999, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001a0a', border: '2px solid var(--bg)' }}>
                  <HeartIcon size={11} filled/>
                </span>}
              </div>

              <div className="font-display" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>{p.short}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{p.team}</div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', marginTop: 4 }}>{p.league} · {p.n} · {p.age} AÑOS</div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Stars value={p.rating} size={11}/>
                  <span className="tnum" style={{ fontSize: 12, fontWeight: 600 }}>{p.rating}</span>
                </div>
                <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)' }}>{p.votes.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          <button className="btn">Ver más jugadores <ArrowR size={12}/></button>
        </div>
      </section>
    </div>
  );
};

window.PlayersScreen = PlayersScreen;
