/* global React */
const { useState } = React;

// Sample data
const TRENDING = [
  { id:1, league:'UCL', leagueShort:'UCL', home:{abbr:'RMA',name:'Real Madrid',c1:'#fff',c2:'#cfd5e6'}, away:{abbr:'BAY',name:'Bayern',c1:'#dc052d',c2:'#7a0319'}, hs:3, as:1, status:'FT', rating:4.6, votes:2412, sport:'Fútbol' },
  { id:2, league:'NBA',  leagueShort:'NBA', home:{abbr:'LAL',name:'Lakers',c1:'#552583',c2:'#3a194c'}, away:{abbr:'BOS',name:'Celtics',c1:'#007a33',c2:'#004d20'}, hs:112, as:108, status:'FT', rating:4.8, votes:5104, sport:'NBA' },
  { id:3, league:'PL',   leagueShort:'PL',  home:{abbr:'ARS',name:'Arsenal',c1:'#ef0107',c2:'#990006'}, away:{abbr:'MCI',name:'Man City',c1:'#6cabdd',c2:'#1f5f8a'}, hs:2, as:2, status:'78\'', live:true, rating:4.4, votes:891, sport:'Fútbol' },
  { id:4, league:'F1',   leagueShort:'F1',  home:{abbr:'VER',name:'Verstappen',c1:'#1e3a8a',c2:'#0a1d4a'}, away:{abbr:'NOR',name:'Norris',c1:'#ff8000',c2:'#a85300'}, hs:'P1', as:'+3.2s', status:'LAP 41', live:true, rating:4.1, votes:332, sport:'F1' },
];

const ACTIVITY = [
  { user:'Amir G.', color:'#7c5cff', action:'calificó', match:'RMA 3–1 BAY', stars:5, time:'hace 2m' },
  { user:'Sofía R.', color:'#ff6b6b', action:'comentó en', match:'LAL 112–108 BOS', stars:null, time:'hace 4m', text:'Tatum sostuvo el cuarto sólo, pero no alcanzó.' },
  { user:'Diego M.', color:'#00b894', action:'añadió a lista', match:'ARG 3–3 FRA', stars:null, list:'Mejores finales', time:'hace 7m' },
  { user:'Marta L.', color:'#fdcb6e', action:'calificó', match:'PSG 1–0 BAY', stars:4, time:'hace 12m' },
  { user:'Kenji T.', color:'#74b9ff', action:'siguió a', match:'Vinicius Jr.', stars:null, time:'hace 18m' },
];

const TOP_PLAYERS = [
  { name:'Vinícius Jr.', team:'Real Madrid', pos:'FWD', n:'BR', c1:'#fff', c2:'#cfd5e6', rating:4.7 },
  { name:'Erling Haaland', team:'Man City', pos:'FWD', n:'NO', c1:'#6cabdd', c2:'#1f5f8a', rating:4.6 },
  { name:'Luka Dončić', team:'LA Lakers', pos:'PG', n:'SI', c1:'#552583', c2:'#3a194c', rating:4.9 },
  { name:'Mbappé', team:'Real Madrid', pos:'FWD', n:'FR', c1:'#fff', c2:'#cfd5e6', rating:4.5 },
  { name:'Jokić', team:'Denver', pos:'C', n:'SR', c1:'#0e2240', c2:'#040b1a', rating:4.8 },
  { name:'Bellingham', team:'Real Madrid', pos:'MID', n:'EN', c1:'#fff', c2:'#cfd5e6', rating:4.4 },
];

const POPULAR_LISTS = [
  { title:'Finales de UCL del siglo', author:'amir.g', items:24, likes:1240, glyph:'⚽' },
  { title:'Game 7s inolvidables', author:'sofia.r', items:18, likes:987, glyph:'🏀' },
  { title:'Comebacks imposibles', author:'kenji.t', items:31, likes:1812, glyph:'⚡' },
];

const HomeScreen = () => (
  <div className="screen scrollarea" style={{ width: 1280, height: 2400, overflowY: 'auto' }}>
    <Navbar active="home" />
    <Ticker />

    {/* HERO — editorial split */}
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 28px 56px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'end' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            <span className="accent">●</span> &nbsp;LA RED SOCIAL DEPORTIVA · TEMP. 25/26
          </div>
          <h1 className="font-display" style={{
            fontSize: 88, lineHeight: 0.95, fontWeight: 600, margin: 0,
            letterSpacing: '-0.04em',
          }}>
            Tu vida<br/>
            deportiva,<br/>
            <span style={{ color: 'var(--primary)' }}>registrada.</span>
          </h1>
          <p style={{ color: 'var(--text-2)', maxWidth: 460, fontSize: 16, lineHeight: 1.5, marginTop: 28 }}>
            Califica partidos, sigue jugadores y construye tu historial. Una bitácora viva del deporte que ves.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button className="btn primary" style={{ padding: '12px 22px' }}>Crear cuenta <ArrowR size={14}/></button>
            <button className="btn">Explorar partidos</button>
          </div>
        </div>

        {/* stats column with editorial layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
          {[
            { k:'2.4M', l:'partidos registrados' },
            { k:'512K', l:'usuarios activos' },
            { k:'18.7K', l:'reseñas hoy' },
            { k:'42', l:'ligas cubiertas' },
          ].map((s,i)=>(
            <div key={i} style={{ background: 'var(--bg)', padding: '24px 20px' }}>
              <div className="font-display tnum" style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.04em' }}>{s.k}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* TRENDING */}
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 28px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="eyebrow"><FireIcon size={11} /> &nbsp;TENDENCIAS · ESTA SEMANA</div>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 600, margin: '8px 0 0', letterSpacing: '-0.03em' }}>Lo más comentado</h2>
        </div>
        <a style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>VER TODOS <ArrowR size={12}/></a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {TRENDING.map(m => (
          <div key={m.id} className="card-hover" style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-elev)' }}>
            {/* Match header strip with team colors */}
            <div style={{ height: 6, display: 'flex' }}>
              <div style={{ flex: 1, background: m.home.c1 }}/>
              <div style={{ flex: 1, background: m.away.c1 }}/>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em' }}>{m.league}</span>
                {m.live ? (
                  <span className="mono" style={{ fontSize: 10, color: 'var(--live)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span className="dot live pulse"></span>{m.status}
                  </span>
                ) : (
                  <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{m.status}</span>
                )}
              </div>
              {/* Teams */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <TeamCrest abbr={m.home.abbr} color1={m.home.c1} color2={m.home.c2} size={32}/>
                  <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{m.home.name}</span>
                  <span className={`score tnum ${m.hs > m.as ? 'win' : (m.hs < m.as ? 'lose' : '')}`} style={{ fontSize: 22, color: m.hs > m.as ? 'var(--primary)' : (m.hs < m.as ? 'var(--text-3)' : '#fff') }}>{m.hs}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <TeamCrest abbr={m.away.abbr} color1={m.away.c1} color2={m.away.c2} size={32}/>
                  <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{m.away.name}</span>
                  <span className={`score tnum`} style={{ fontSize: 22, color: m.as > m.hs ? 'var(--primary)' : (m.as < m.hs ? 'var(--text-3)' : '#fff') }}>{m.as}</span>
                </div>
              </div>
              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Stars value={m.rating} size={12}/>
                  <span className="tnum" style={{ fontSize: 13, fontWeight: 600 }}>{m.rating}</span>
                </div>
                <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{m.votes.toLocaleString()} votos</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* HOW IT WORKS — text-led, no decorative icons */}
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 28px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64 }}>
        <div>
          <div className="eyebrow">CÓMO FUNCIONA</div>
          <h2 className="font-display" style={{ fontSize: 40, fontWeight: 600, margin: '8px 0 0', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Tres pasos.<br/>Sin <span style={{ color: 'var(--primary)' }}>fricción.</span>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { n:'01', t:'Mira el partido', d:'Sigue ligas que te importan. Sincronizamos con ESPN para tener resultados en tiempo real.' },
            { n:'02', t:'Califica y reseña', d:'Cinco estrellas, una opinión, o sólo un ★. Tu historial se construye solo.' },
            { n:'03', t:'Compite y debate', d:'Listas, predicciones, conversaciones por partido. Tu comunidad deportiva.' },
          ].map((s,i)=>(
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24, padding: '28px 0', borderTop: '1px solid var(--line)' }}>
              <span className="mono" style={{ fontSize: 12, color: 'var(--primary)', letterSpacing: '0.1em' }}>{s.n}</span>
              <div>
                <h3 className="font-display" style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>{s.t}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.55, margin: '8px 0 0', maxWidth: 540 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* LIVE ACTIVITY — feed style */}
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 28px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: 100 }}>
          <div className="eyebrow"><span className="dot green"></span> &nbsp;ACTIVIDAD EN VIVO</div>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 600, margin: '8px 0 16px', letterSpacing: '-0.03em' }}>La comunidad nunca duerme</h2>
          <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.55 }}>
            Cada segundo hay una nueva reseña en RecordR. Mira el pulso del deporte, en tiempo real.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: 24, border: '1px solid var(--line)' }}>
            <div style={{ padding: '16px 14px', borderRight: '1px solid var(--line)' }}>
              <div className="font-display tnum" style={{ fontSize: 28, fontWeight: 600, color: 'var(--primary)' }}>847</div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>partidos en vivo</div>
            </div>
            <div style={{ padding: '16px 14px' }}>
              <div className="font-display tnum" style={{ fontSize: 28, fontWeight: 600, color: 'var(--primary)' }}>12.4K</div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>reseñas hoy</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line)' }}>
          {ACTIVITY.map((a, i) => (
            <div key={i} className="row-hover" style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 14, padding: '18px 4px', borderBottom: '1px solid var(--line)', alignItems: 'start' }}>
              <Avatar name={a.user} color={a.color} size={36}/>
              <div>
                <div style={{ fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{a.user}</span>
                  <span style={{ color: 'var(--text-3)' }}> {a.action} </span>
                  <span style={{ fontWeight: 500, color: 'var(--primary)' }}>{a.match}</span>
                  {a.list && <span style={{ color: 'var(--text-3)' }}> en <span style={{ color: 'var(--text)', fontWeight: 500 }}>"{a.list}"</span></span>}
                  {a.stars && <span style={{ color: 'var(--text-3)' }}> con </span>}
                  {a.stars && <Stars value={a.stars} size={11}/>}
                </div>
                {a.text && <p style={{ color: 'var(--text-2)', fontSize: 13, margin: '6px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>"{a.text}"</p>}
              </div>
              <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* TOP PLAYERS */}
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 28px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="eyebrow">JUGADORES · MÁS SEGUIDOS</div>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 600, margin: '8px 0 0', letterSpacing: '-0.03em' }}>Quien está acaparando la atención</h2>
        </div>
        <a style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>VER TODOS <ArrowR size={12}/></a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
        {TOP_PLAYERS.map((p,i)=>(
          <div key={i} className="row-hover" style={{ background: 'var(--bg)', padding: 18, position: 'relative' }}>
            <div className="ph-img" style={{ width: '100%', aspectRatio: '1/1', borderRadius: 6, marginBottom: 12 }}>
              <span>FOTO</span>
            </div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em' }}>#{i+1} · {p.pos}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{p.team}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <Stars value={p.rating} size={10}/>
              <span className="tnum mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{p.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* POPULAR LISTS */}
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 28px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="eyebrow">LISTAS · DE LA COMUNIDAD</div>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 600, margin: '8px 0 0', letterSpacing: '-0.03em' }}>Colecciones populares</h2>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {POPULAR_LISTS.map((l,i)=>(
          <div key={i} className="card-hover" style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 24, background: 'var(--bg-elev)' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>{l.glyph}</div>
            <h3 className="font-display" style={{ fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>{l.title}</h3>
            <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6, letterSpacing: '0.08em' }}>POR @{l.author}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
              <span className="mono tnum" style={{ fontSize: 11, color: 'var(--text-2)' }}>{l.items} partidos</span>
              <span className="mono tnum" style={{ fontSize: 11, color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <HeartIcon size={11} filled/> {l.likes}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA + Footer */}
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 28px' }}>
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
        <h2 className="font-display" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>
          Empieza tu <span style={{ color: 'var(--primary)' }}>bitácora</span>.
        </h2>
        <p style={{ color: 'var(--text-2)', fontSize: 16, marginTop: 20, lineHeight: 1.5 }}>
          Gratis. Sin anuncios. Sólo deporte y la conversación que lo rodea.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
          <button className="btn primary" style={{ padding: '14px 28px', fontSize: 14 }}>Crear cuenta <ArrowR size={14}/></button>
          <button className="btn" style={{ padding: '14px 28px', fontSize: 14 }}>Explorar</button>
        </div>
      </div>
    </section>

    <footer style={{ borderTop: '1px solid var(--line)', padding: '32px 28px', maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Logo size={20}/>
      <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em' }}>© 2026 RECORDR · DATOS POR ESPN</span>
    </footer>
  </div>
);

window.HomeScreen = HomeScreen;
