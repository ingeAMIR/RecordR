/* global React */
const { useState: useStateMatches } = React;

const MATCHES_DATA = [
  { id:1, league:'UCL', date:'OCT 22', time:'21:00', venue:'Bernabéu',
    home:{abbr:'RMA',name:'Real Madrid',c1:'#fff',c2:'#cfd5e6'},
    away:{abbr:'BAY',name:'Bayern München',c1:'#dc052d',c2:'#7a0319'},
    hs:3, as:1, status:'FT', rating:4.6, votes:2412, comments:418,
    headline:'Vinicius brilla con doblete decisivo' },
  { id:2, league:'NBA', date:'OCT 22', time:'02:00', venue:'Crypto.com',
    home:{abbr:'LAL',name:'LA Lakers',c1:'#552583',c2:'#3a194c'},
    away:{abbr:'BOS',name:'Boston Celtics',c1:'#007a33',c2:'#004d20'},
    hs:112, as:108, status:'FT', rating:4.8, votes:5104, comments:1230,
    headline:'Dončić cierra con 38 puntos' },
  { id:3, league:'PL', date:'OCT 22', time:'17:30', venue:'Emirates',
    home:{abbr:'ARS',name:'Arsenal',c1:'#ef0107',c2:'#990006'},
    away:{abbr:'MCI',name:'Manchester City',c1:'#6cabdd',c2:'#1f5f8a'},
    hs:2, as:2, status:'78\'', live:true, rating:4.4, votes:891, comments:312,
    headline:'Empate vibrante con cuatro goles' },
  { id:4, league:'LL', date:'OCT 22', time:'21:00', venue:'Camp Nou',
    home:{abbr:'BAR',name:'Barcelona',c1:'#a50044',c2:'#004d98'},
    away:{abbr:'ATM',name:'Atlético Madrid',c1:'#ce3524',c2:'#272e61'},
    hs:0, as:0, status:'PRE', upcoming:true, rating:null, votes:0, comments:0,
    headline:null },
  { id:5, league:'NBA', date:'OCT 22', time:'01:00', venue:'TD Garden',
    home:{abbr:'GSW',name:'Golden State',c1:'#1d428a',c2:'#0a1f4a'},
    away:{abbr:'PHX',name:'Phoenix Suns',c1:'#1d1160',c2:'#0a0830'},
    hs:118, as:124, status:'FT', rating:4.2, votes:744, comments:189,
    headline:'Booker imparable: 41 pts y un triple histórico' },
  { id:6, league:'NFL', date:'OCT 21', time:'20:25', venue:'Arrowhead',
    home:{abbr:'KC',name:'Chiefs',c1:'#e31837',c2:'#7a0c1c'},
    away:{abbr:'BUF',name:'Bills',c1:'#00338d',c2:'#001a4a'},
    hs:27, as:24, status:'FT', rating:4.5, votes:2104, comments:512,
    headline:'Mahomes magia en el último drive' },
  { id:7, league:'F1', date:'OCT 22', time:'14:00', venue:'COTA',
    home:{abbr:'VER',name:'Verstappen',c1:'#1e3a8a',c2:'#0a1d4a'},
    away:{abbr:'NOR',name:'Norris',c1:'#ff8000',c2:'#a85300'},
    hs:'P1', as:'+3.2s', status:'LAP 41', live:true, rating:4.1, votes:332, comments:98,
    headline:'Verstappen lidera con margen ajustado' },
  { id:8, league:'UCL', date:'OCT 23', time:'21:00', venue:'Anfield',
    home:{abbr:'LIV',name:'Liverpool',c1:'#c8102e',c2:'#7a0a1c'},
    away:{abbr:'PSG',name:'Paris SG',c1:'#004170',c2:'#001a30'},
    hs:0, as:0, status:'PRE', upcoming:true, rating:null, votes:0, comments:0,
    headline:null },
  { id:9, league:'MLB', date:'OCT 21', time:'20:00', venue:'Yankee Stadium',
    home:{abbr:'NYY',name:'Yankees',c1:'#0c2340',c2:'#040c1a'},
    away:{abbr:'LAD',name:'Dodgers',c1:'#005a9c',c2:'#001f3d'},
    hs:5, as:4, status:'FT', rating:4.3, votes:621, comments:145,
    headline:'Walk-off en la novena' },
];

const SPORTS = [
  { k:'all', label:'Todos', n:1240 },
  { k:'football', label:'Fútbol', n:512 },
  { k:'basketball', label:'Basket', n:298 },
  { k:'nfl', label:'NFL', n:124 },
  { k:'mlb', label:'MLB', n:181 },
  { k:'f1', label:'F1', n:42 },
];
const STATUSES = [
  { k:'all', label:'Todos' },
  { k:'live', label:'En vivo', live:true },
  { k:'completed', label:'Finalizados' },
  { k:'upcoming', label:'Próximos' },
];

const MatchRow = ({ m }) => {
  const [rating, setRating] = useStateMatches(0);
  const [hover, setHover] = useStateMatches(0);
  const [open, setOpen] = useStateMatches(false);
  return (
    <div className="row-hover" style={{
      display: 'grid',
      gridTemplateColumns: '110px 1fr 180px 200px 220px 90px',
      gap: 20, alignItems: 'center',
      padding: '18px 20px',
      borderBottom: '1px solid var(--line)',
      cursor: 'pointer',
    }}>
      {/* Date / status */}
      <div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: '0.08em' }}>{m.date}</div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{m.time}</div>
      </div>

      {/* Teams + score */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <TeamCrest abbr={m.home.abbr} color1={m.home.c1} color2={m.home.c2} size={26}/>
          <span style={{ fontSize: 14, fontWeight: m.hs > m.as ? 600 : 500, flex: 1 }}>{m.home.name}</span>
          {!m.upcoming && (
            <span className="score tnum" style={{ fontSize: 18, color: m.hs > m.as ? 'var(--primary)' : (m.hs < m.as ? 'var(--text-3)' : '#fff'), minWidth: 32, textAlign: 'right' }}>{m.hs}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <TeamCrest abbr={m.away.abbr} color1={m.away.c1} color2={m.away.c2} size={26}/>
          <span style={{ fontSize: 14, fontWeight: m.as > m.hs ? 600 : 500, flex: 1 }}>{m.away.name}</span>
          {!m.upcoming && (
            <span className="score tnum" style={{ fontSize: 18, color: m.as > m.hs ? 'var(--primary)' : (m.as < m.hs ? 'var(--text-3)' : '#fff'), minWidth: 32, textAlign: 'right' }}>{m.as}</span>
          )}
        </div>
      </div>

      {/* League + status */}
      <div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 4 }}>{m.league} · {m.venue}</div>
        {m.live ? (
          <span className="mono" style={{ fontSize: 10, color: 'var(--live)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="dot live pulse"></span>{m.status}
          </span>
        ) : m.upcoming ? (
          <span className="mono" style={{ fontSize: 10, color: 'var(--text-2)' }}>PRÓXIMO</span>
        ) : (
          <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>FINALIZADO</span>
        )}
      </div>

      {/* Headline */}
      <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4, fontStyle: m.headline ? 'normal' : 'italic' }}>
        {m.headline ? `"${m.headline}"` : <span style={{ color: 'var(--text-4)' }}>Sin reseña aún</span>}
      </div>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {m.rating ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 60 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Stars value={m.rating} size={11}/>
                <span className="tnum" style={{ fontSize: 12, fontWeight: 600 }}>{m.rating}</span>
              </div>
              <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)' }}>{m.votes.toLocaleString()} votos</span>
            </div>
            {open ? (
              <div onClick={(e) => e.stopPropagation()} style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
                background: 'var(--bg-elev)', border: '1px solid var(--primary)', borderRadius: 4,
              }}>
                {[1,2,3,4,5].map(s => (
                  <StarIcon key={s} size={14} filled={(hover||rating) >= s}
                    onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
                    onClick={() => { setRating(s); setOpen(false); }} />
                ))}
              </div>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); setOpen(true); }}
                style={{
                  background: 'transparent', border: '1px solid var(--line-2)',
                  color: 'var(--text-2)', padding: '4px 10px', borderRadius: 4,
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                <StarIcon size={11}/> Calificar
              </button>
            )}
          </>
        ) : <span className="mono" style={{ fontSize: 10, color: 'var(--text-4)' }}>—</span>}
      </div>

      {/* Comments */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-2)', fontSize: 12 }}>
        <ChatIcon size={12}/>
        <span className="tnum">{m.comments.toLocaleString()}</span>
      </div>
    </div>
  );
};

const MatchesScreen = () => {
  const [sport, setSport] = useStateMatches('all');
  const [status, setStatus] = useStateMatches('all');
  const [view, setView] = useStateMatches('list');

  return (
    <div className="screen scrollarea" style={{ width: 1280, height: 1600, overflowY: 'auto' }}>
      <Navbar active="matches" />
      <Ticker />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px 24px' }}>
        <div className="eyebrow"><CalIcon size={11}/> &nbsp;OCT 21–23 · 2026</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
          <h1 className="font-display" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', margin: 0 }}>
            Partidos
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>1,240 partidos · 42 ligas</span>
            <div style={{ display: 'flex', border: '1px solid var(--line-2)', borderRadius: 6, overflow: 'hidden' }}>
              {[
                { k:'list', label:'Lista' },
                { k:'grid', label:'Grid' },
              ].map(v => (
                <button key={v.k} onClick={() => setView(v.k)} style={{
                  background: view===v.k ? 'var(--text)' : 'transparent',
                  color: view===v.k ? '#000' : 'var(--text-2)',
                  border: 'none', padding: '6px 14px', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{v.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 5 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Sport tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {SPORTS.map(s => (
              <button key={s.k} onClick={() => setSport(s.k)} className={`chip ${sport===s.k?'active':''}`}
                style={{ cursor: 'pointer', fontFamily: 'inherit' }}>
                {s.label} <span className="tnum" style={{ opacity: 0.6, marginLeft: 4 }}>{s.n}</span>
              </button>
            ))}
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--line)' }}/>
          <div style={{ display: 'flex', gap: 4 }}>
            {STATUSES.map(s => (
              <button key={s.k} onClick={() => setStatus(s.k)} className={`chip ${status===s.k?'active':''}`}
                style={{ cursor: 'pointer', fontFamily: 'inherit' }}>
                {s.live && <span className="dot live pulse"/>}
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="chip" style={{ cursor: 'pointer' }}><FilterIcon size={11}/> Más filtros</button>
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* List header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '110px 1fr 180px 200px 220px 90px',
            gap: 20, padding: '14px 20px',
            borderBottom: '1px solid var(--line)',
            background: 'var(--bg-elev)',
          }}>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em' }}>FECHA</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em' }}>EQUIPOS · MARCADOR</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em' }}>LIGA · ESTADO</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em' }}>RESEÑA</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em' }}>RATING</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em' }}>COMENTARIOS</span>
          </div>
          {MATCHES_DATA.map(m => <MatchRow key={m.id} m={m} />)}
        </div>
      ) : (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {MATCHES_DATA.map(m => (
              <div key={m.id} className="card-hover" style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 18, background: 'var(--bg-elev)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em' }}>{m.league} · {m.date}</span>
                  {m.live ? <span className="mono" style={{ fontSize: 10, color: 'var(--live)' }}><span className="dot live pulse" style={{ marginRight: 6 }}/>{m.status}</span>
                    : m.upcoming ? <span className="mono" style={{ fontSize: 10, color: 'var(--text-2)' }}>PRÓXIMO</span>
                    : <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>FT</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <TeamCrest abbr={m.home.abbr} color1={m.home.c1} color2={m.home.c2} size={28}/>
                    <span style={{ fontSize: 14, flex: 1 }}>{m.home.name}</span>
                    {!m.upcoming && <span className="score tnum" style={{ fontSize: 22, color: m.hs > m.as ? 'var(--primary)' : (m.hs < m.as ? 'var(--text-3)' : '#fff') }}>{m.hs}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <TeamCrest abbr={m.away.abbr} color1={m.away.c1} color2={m.away.c2} size={28}/>
                    <span style={{ fontSize: 14, flex: 1 }}>{m.away.name}</span>
                    {!m.upcoming && <span className="score tnum" style={{ fontSize: 22, color: m.as > m.hs ? 'var(--primary)' : (m.as < m.hs ? 'var(--text-3)' : '#fff') }}>{m.as}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                  {m.rating ? (<>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Stars value={m.rating} size={11}/>
                      <span className="tnum" style={{ fontSize: 12 }}>{m.rating}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{m.comments} comentarios</span>
                  </>) : <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>SIN VOTOS AÚN</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

window.MatchesScreen = MatchesScreen;
