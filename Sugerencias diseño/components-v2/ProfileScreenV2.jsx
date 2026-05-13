/* global React, NavbarV2 */

const ProfileScreenV2 = () => {
  const reviews = [
    {date:'12 FEB',m:'Real Madrid 2-3 Barcelona',l:'LALIGA',r:9.4,t:'Una noche para el recuerdo. El medio del Barça desarmó completamente al Madrid en la segunda parte. Pedri estuvo magistral y Yamal sigue siendo de otro planeta.',l_:84,c:23},
    {date:'08 FEB',m:'Arsenal 2-1 Tottenham',l:'PREMIER',r:8.6,t:'Saka decidió el derbi del norte. Atmósfera espectacular en el Emirates. Postecoglou tiene mucho que pensar.',l_:42,c:11},
    {date:'04 FEB',m:'Bayern 4-2 Dortmund',l:'BUNDESLIGA',r:7.9,t:'Goleada y festival ofensivo. Kane sigue facturando como si jugara en Anfield.',l_:67,c:18},
    {date:'01 FEB',m:'Inter 2-4 Juventus',l:'SERIE A',r:8.8,t:'Vlahovic firmó un triplete para enmarcar. La defensa del Inter, ausente.',l_:54,c:14},
  ];

  return (
    <div className="screen">
      <NavbarV2 active="" />

      {/* Profile header with gradient */}
      <section style={{position:'relative',padding:'48px 32px 0',overflow:'hidden',borderBottom:'1px solid var(--line)'}}>
        <div style={{position:'absolute',top:'-150px',left:'30%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,102,0.10),transparent 60%)',filter:'blur(60px)',pointerEvents:'none'}}></div>

        <div style={{maxWidth:1200,margin:'0 auto',position:'relative'}}>
          <div style={{display:'flex',alignItems:'flex-end',gap:32,marginBottom:36}}>
            <div style={{
              width:140,height:140,borderRadius:'50%',
              background:'linear-gradient(135deg,#00ff66,#00a846)',
              display:'flex',alignItems:'center',justifyContent:'center',
              color:'#000',fontFamily:'Outfit',fontWeight:900,fontSize:48,
              boxShadow:'0 0 30px rgba(0,255,102,0.35)',flexShrink:0
            }}>JC</div>

            <div style={{flex:1,paddingBottom:8}}>
              <div className="eyebrow" style={{marginBottom:8}}>@juancarlos · MIEMBRO DESDE ENE 2024</div>
              <h1 className="font-outfit" style={{fontSize:52,margin:'0 0 10px',letterSpacing:'-0.04em'}}>Juan Carlos Pérez</h1>
              <p style={{fontSize:15,color:'var(--text-2)',margin:'0 0 14px',maxWidth:600,lineHeight:1.5}}>
                Madridista de cuna, pero el fútbol bonito gana siempre. Aquí para hablar de táctica, no de banderas.
              </p>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <span className="chip">🇪🇸 Madrid, España</span>
                <span className="chip green">⚪ Real Madrid</span>
                <span className="chip">⚽ Premier · LaLiga · Champions</span>
              </div>
            </div>

            <div style={{display:'flex',gap:10,paddingBottom:8}}>
              <button className="btn outline">Compartir</button>
              <button className="btn primary">Editar perfil</button>
            </div>
          </div>

          {/* Stat strip */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:0,padding:'28px 0',borderTop:'1px solid var(--line)'}}>
            {[
              {l:'PARTIDOS CALIFICADOS',v:'247',d:'+18 este mes'},
              {l:'RATING PROMEDIO',v:'7.8',d:'sobre 10'},
              {l:'OPINIONES',v:'89',d:'1.2K likes recibidos'},
              {l:'LISTAS CREADAS',v:'12',d:'4 públicas'},
              {l:'SEGUIDORES',v:'342',d:'+24 esta semana'},
            ].map((s,i)=>(
              <div key={i} style={{padding:'0 24px',borderLeft:i?'1px solid var(--line)':'none'}}>
                <div className="eyebrow" style={{marginBottom:10}}>{s.l}</div>
                <div className="font-outfit tnum" style={{fontSize:38,fontWeight:900,letterSpacing:'-0.03em',lineHeight:1, color:i===1?'var(--primary)':'#fff'}}>{s.v}</div>
                <div className="mono" style={{fontSize:10,color:'var(--text-3)',marginTop:6}}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs + body */}
      <section style={{padding:'32px 32px 80px'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'flex',gap:24,borderBottom:'1px solid var(--line-2)',marginBottom:32}}>
            {['Reseñas · 89','Listas · 12','Jugadores favoritos · 28','Actividad'].map((t,i)=>(
              <button key={i} style={{
                padding:'14px 0',background:'none',border:'none',
                borderBottom: i===0 ? '2px solid var(--primary)' : '2px solid transparent',
                color: i===0 ? 'var(--text)' : 'var(--text-3)',
                fontWeight:700,fontSize:13,letterSpacing:'-0.01em',cursor:'pointer',
                marginBottom:-1
              }}>{t}</button>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:40}}>
            {/* Reviews log */}
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                <div className="eyebrow">BITÁCORA · ÚLTIMAS RESEÑAS</div>
                <select className="field" style={{maxWidth:160,padding:'8px 12px',fontSize:11}}><option>Más recientes</option><option>Mejor calificadas</option></select>
              </div>

              {reviews.map((r,i)=>(
                <div key={i} style={{display:'grid',gridTemplateColumns:'72px 1fr',gap:18,padding:'24px 0',borderTop:i?'1px solid var(--line)':'1px solid var(--line)'}}>
                  <div className="mono" style={{fontSize:11,color:'var(--text-3)',letterSpacing:'0.05em',paddingTop:2}}>{r.date}</div>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                      <span className="chip" style={{padding:'3px 8px',fontSize:9}}>{r.l}</span>
                      <span style={{fontSize:14,fontWeight:700,color:'var(--text)'}}>{r.m}</span>
                      <div style={{flex:1}}></div>
                      <div style={{padding:'4px 10px',background:'rgba(0,255,102,0.1)',borderRadius:6,border:'1px solid rgba(0,255,102,0.25)'}}>
                        <span className="font-outfit tnum" style={{fontSize:14,fontWeight:900,color:'var(--primary)'}}>{r.r}</span>
                      </div>
                    </div>
                    <p style={{fontSize:14,lineHeight:1.55,color:'var(--text-2)',margin:'0 0 10px'}}>{r.t}</p>
                    <div style={{display:'flex',gap:18,fontSize:11,color:'var(--text-3)'}}>
                      <span>♥ {r.l_}</span><span>💬 {r.c}</span><span>↗ Compartir</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div style={{display:'flex',flexDirection:'column',gap:18}}>
              <div className="glass-panel" style={{padding:24,borderRadius:16,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:-40,right:-40,width:140,height:140,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,102,0.15),transparent)',filter:'blur(20px)'}}></div>
                <div className="eyebrow" style={{marginBottom:16}}>DISTRIBUCIÓN DE RATINGS</div>
                {[{r:'9-10',c:24,p:90},{r:'7-8',c:42,p:75},{r:'5-6',c:18,p:30},{r:'1-4',c:5,p:8}].map((b,i)=>(
                  <div key={i} style={{display:'grid',gridTemplateColumns:'42px 1fr 28px',alignItems:'center',gap:10,marginBottom:10}}>
                    <span className="mono" style={{fontSize:11,color:'var(--text-3)',fontWeight:700}}>{b.r}</span>
                    <div className="bar"><i style={{width:`${b.p}%`}}></i></div>
                    <span className="mono tnum" style={{fontSize:11,color:'var(--text-3)'}}>{b.c}</span>
                  </div>
                ))}
              </div>

              <div className="glass-panel" style={{padding:24,borderRadius:16}}>
                <div className="eyebrow" style={{marginBottom:14}}>JUGADORES FAVORITOS</div>
                {[
                  {n:'Jude Bellingham',v:9.4},
                  {n:'Vinicius Jr.',v:9.0},
                  {n:'Kylian Mbappé',v:8.6},
                  {n:'Federico Valverde',v:8.4},
                ].map((p,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderTop:i?'1px solid var(--line)':'none'}}>
                    <div className="ph-img" style={{width:36,height:36,borderRadius:'50%',fontSize:9}}>{p.n.split(' ').map(s=>s[0]).join('')}</div>
                    <div style={{flex:1,fontSize:13,fontWeight:700}}>{p.n}</div>
                    <div className="font-outfit tnum" style={{fontSize:16,fontWeight:900,color:'var(--primary)'}}>{p.v}</div>
                  </div>
                ))}
              </div>

              <div style={{
                padding:24,borderRadius:16,
                background:'linear-gradient(135deg,rgba(0,255,102,0.12),rgba(0,168,70,0.04))',
                border:'1px solid rgba(0,255,102,0.3)'
              }}>
                <div className="eyebrow" style={{marginBottom:8,color:'var(--primary)'}}>LOGRO DESBLOQUEADO</div>
                <h3 className="font-outfit" style={{fontSize:22,margin:'0 0 8px',letterSpacing:'-0.02em'}}>Crítico de hierro</h3>
                <p style={{fontSize:12,lineHeight:1.5,color:'var(--text-2)',margin:'0 0 14px'}}>
                  Has calificado partidos en <span style={{color:'var(--primary)',fontWeight:700}}>5 ligas distintas</span> este mes.
                </p>
                <div className="bar"><i style={{width:'72%'}}></i></div>
                <div className="mono" style={{fontSize:10,color:'var(--text-3)',marginTop:8}}>NIVEL 7 · 72/100 XP</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

window.ProfileScreenV2 = ProfileScreenV2;
