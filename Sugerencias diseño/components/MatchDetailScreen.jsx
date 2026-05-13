/* global React */
const { useState: useStateMD } = React;

const OPINIONS = [
  { user:'Amir Goyri', color:'#7c5cff', time:'hace 12m', stars:5,
    text:'Clase magistral de Vinicius. Cuando entra al área cambia la velocidad del partido. Bayern no supo cómo defenderlo en el segundo tiempo.',
    likes:48, replies:[
      { user:'Sofía R.', color:'#ff6b6b', time:'hace 8m', text:'Totalmente. El segundo gol fue inevitable.', likes:12 },
    ]
  },
  { user:'Diego Martín', color:'#00b894', time:'hace 28m', stars:4,
    text:'Bellingham organizó todo desde el centro. Sin él, otra historia. Bayern sigue sin un 9 de verdad después de la lesión de Kane.',
    likes:31, replies:[]
  },
  { user:'Marta López', color:'#fdcb6e', time:'hace 1h', stars:5,
    text:'Partido digno de UCL. Ritmo, calidad, drama. Cinco estrellas sin pensarlo.',
    likes:67, replies:[]
  },
  { user:'Kenji T.', color:'#74b9ff', time:'hace 2h', stars:3,
    text:'Disfruté el partido pero el VAR rompió el ritmo en el primer tiempo. Necesitamos hablar de eso.',
    likes:18, replies:[]
  },
];

const MatchDetailScreen = () => {
  const [tab, setTab] = useStateMD('overview');
  const [hover, setHover] = useStateMD(0);
  const [rating, setRating] = useStateMD(0);
  const [comment, setComment] = useStateMD('');

  return (
    <div className="screen scrollarea" style={{ width: 1280, height: 1900, overflowY: 'auto' }}>
      <Navbar active="matches" />
      <Ticker />

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 28px 0' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.08em' }}>
          PARTIDOS / UCL / OCT 22, 2026 /<span style={{ color: 'var(--text-2)' }}> RMA vs BAY</span>
        </div>
      </div>

      {/* Hero block — minimalist */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 28px 40px', borderBottom: '1px solid var(--line)' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>UEFA CHAMPIONS LEAGUE · OCTAVOS · IDA</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 48, alignItems: 'center', padding: '40px 0' }}>
          {/* Home */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em' }}>LOCAL · ESP</div>
              <h2 className="font-display" style={{ fontSize: 36, fontWeight: 600, margin: '4px 0', letterSpacing: '-0.03em' }}>Real Madrid</h2>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>15× Champions · 36 LaLiga</div>
            </div>
            <TeamCrest abbr="RMA" color1="#fff" color2="#cfd5e6" size={88}/>
          </div>

          {/* Score */}
          <div style={{ textAlign: 'center' }}>
            <div className="font-display tnum" style={{ fontSize: 72, fontWeight: 600, letterSpacing: '-0.05em', lineHeight: 1 }}>
              <span style={{ color: 'var(--primary)' }}>3</span>
              <span style={{ color: 'var(--text-3)', margin: '0 18px', fontWeight: 400 }}>:</span>
              <span style={{ color: 'var(--text-3)' }}>1</span>
            </div>
            <div className="mono" style={{ marginTop: 12, fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.1em' }}>
              FINALIZADO · 90+4'
            </div>
          </div>

          {/* Away */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <TeamCrest abbr="BAY" color1="#dc052d" color2="#7a0319" size={88}/>
            <div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em' }}>VISITA · GER</div>
              <h2 className="font-display" style={{ fontSize: 36, fontWeight: 600, margin: '4px 0', letterSpacing: '-0.03em' }}>Bayern München</h2>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>6× Champions · 33 Bundesliga</div>
            </div>
          </div>
        </div>

        {/* Match meta strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', marginTop: 24 }}>
          {[
            ['Estadio', 'Santiago Bernabéu'],
            ['Asistencia', '81,044'],
            ['Árbitro', 'Daniele Orsato'],
            ['Posesión', '54% — 46%'],
          ].map(([k,v],i)=>(
            <div key={i} style={{ background: 'var(--bg)', padding: '16px 18px' }}>
              <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{k}</div>
              <div className="font-display" style={{ fontSize: 18, fontWeight: 500, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24, alignItems: 'center' }}>
          <button className="btn primary"><StarIcon size={14}/> Calificar este partido</button>
          <button className="btn"><BookmarkIcon size={14}/> Añadir a lista</button>
          <button className="btn"><HeartIcon size={14}/> Seguir</button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text-2)', fontSize: 13 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Stars value={4.6} size={14}/>
              <span className="tnum font-display" style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>4.6</span>
            </span>
            <span style={{ width: 1, height: 18, background: 'var(--line-2)' }}/>
            <span className="mono" style={{ fontSize: 11 }}>2,412 votos</span>
            <span className="mono" style={{ fontSize: 11 }}>418 comentarios</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', gap: 4 }}>
          {[
            { k:'overview', label:'Resumen' },
            { k:'opinions', label:'Conversación', n:418 },
            { k:'lineups', label:'Alineaciones' },
            { k:'stats', label:'Estadísticas' },
            { k:'ratings', label:'Ratings' },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              background: 'transparent', border: 'none', padding: '14px 16px',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              color: tab===t.k ? 'var(--text)' : 'var(--text-3)',
              borderBottom: tab===t.k ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -1,
            }}>
              {t.label}
              {t.n && <span className="mono tnum" style={{ marginLeft: 6, fontSize: 10, color: 'var(--text-3)' }}>{t.n}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content — Conversation + Rating breakdown */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 48 }}>

          {/* Left — Conversation */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>CONVERSACIÓN · 418 OPINIONES</div>

            {/* Compose */}
            <div style={{ border: '1px solid var(--line-2)', borderRadius: 8, padding: 16, background: 'var(--bg-elev)', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Avatar name="Tú" color="var(--primary)" size={32}/>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Tu calificación:</span>
                <div style={{ display: 'flex', gap: 4 }} onMouseLeave={() => setHover(0)}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} onMouseEnter={() => setHover(s)} onClick={() => setRating(s)}
                      style={{ cursor: 'pointer', color: 'var(--primary)' }}>
                      <StarIcon size={20} filled={(hover||rating) >= s}/>
                    </span>
                  ))}
                </div>
                {rating > 0 && <span className="mono tnum" style={{ fontSize: 11, color: 'var(--primary)' }}>{rating}.0</span>}
              </div>
              <textarea
                value={comment} onChange={e => setComment(e.target.value)}
                className="field" style={{ minHeight: 64, resize: 'vertical' }}
                placeholder="Escribe tu opinión sobre este partido..."/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>MARKDOWN BÁSICO · {280 - comment.length} caracteres</span>
                <button className="btn primary" disabled={!comment.trim()} style={{ opacity: comment.trim() ? 1 : 0.4 }}>
                  Publicar <SendIcon size={12}/>
                </button>
              </div>
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              <button className="chip active">Top</button>
              <button className="chip">Recientes</button>
              <button className="chip">Más estrellas</button>
            </div>

            {/* Opinion list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {OPINIONS.map((o, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 14 }}>
                  <Avatar name={o.user} color={o.color} size={36}/>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{o.user}</span>
                      <Stars value={o.stars} size={11}/>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{o.time}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.55, margin: '0 0 12px' }}>{o.text}</p>
                    <div style={{ display: 'flex', gap: 16, color: 'var(--text-3)', fontSize: 12 }}>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0, fontSize: 12, fontFamily: 'inherit' }}>
                        <HeartIcon size={12}/> <span className="tnum">{o.likes}</span>
                      </button>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0, fontSize: 12, fontFamily: 'inherit' }}>
                        <ReplyIcon size={12}/> Responder
                      </button>
                    </div>
                    {o.replies.length > 0 && (
                      <div style={{ marginTop: 16, paddingLeft: 16, borderLeft: '1px solid var(--line-2)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {o.replies.map((r, j) => (
                          <div key={j} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 10 }}>
                            <Avatar name={r.user} color={r.color} size={26}/>
                            <div>
                              <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
                                <span style={{ fontSize: 12, fontWeight: 600 }}>{r.user}</span>
                                <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{r.time}</span>
                              </div>
                              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{r.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Rating breakdown sticky */}
          <aside>
            <div style={{ position: 'sticky', top: 100 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>RATING DE LA COMUNIDAD</div>

              <div style={{ border: '1px solid var(--line)', padding: 24, background: 'var(--bg-elev)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                  <span className="font-display tnum" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--primary)' }}>4.6</span>
                  <span className="font-display" style={{ fontSize: 18, color: 'var(--text-3)' }}>/ 5</span>
                </div>
                <Stars value={4.6} size={16}/>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 8, letterSpacing: '0.08em' }}>
                  BASADO EN 2,412 VOTOS
                </div>

                {/* Histogram */}
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { s:5, n:1620, p:67 },
                    { s:4, n:540,  p:22 },
                    { s:3, n:148,  p:6 },
                    { s:2, n:62,   p:3 },
                    { s:1, n:42,   p:2 },
                  ].map(r => (
                    <div key={r.s} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 50px', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-2)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>{r.s}<StarIcon size={9} filled/></span>
                      <div className="bar"><i style={{ width: r.p+'%' }}/></div>
                      <span className="mono tnum" style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'right' }}>{r.n.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top reseñas destacadas */}
              <div className="eyebrow" style={{ marginTop: 32, marginBottom: 12 }}>RESEÑA DESTACADA</div>
              <div style={{ border: '1px solid var(--line)', padding: 20, background: 'var(--bg-elev)' }}>
                <div style={{ fontSize: 24, color: 'var(--primary)', lineHeight: 0.5, marginBottom: 8 }}>"</div>
                <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, color: 'var(--text)' }}>
                  Una clase de cómo ganar partidos importantes. Vinicius decidió, Modrić ordenó. Bayern necesita reinventarse.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                  <Avatar name="Marta L." color="#fdcb6e" size={24}/>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>marta.lopez</span>
                  <Stars value={5} size={10}/>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

window.MatchDetailScreen = MatchDetailScreen;
