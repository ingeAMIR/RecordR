/* global React, NavbarV2 */

const MatchDetailScreenV2 = () => {
  const events = [
    {m:"12'", t:'GOL', team:'home', p:'Vinicius Jr.', d:'Asistencia de Bellingham', g:true},
    {m:"23'", t:'AMARILLA', team:'away', p:'Araujo', d:'Falta táctica'},
    {m:"38'", t:'GOL', team:'away', p:'Lewandowski', d:'Centro de Yamal', g:true},
    {m:"56'", t:'GOL', team:'home', p:'Bellingham', d:'Disparo de fuera del área', g:true},
    {m:"71'", t:'GOL', team:'away', p:'Pedri', d:'Jugada colectiva del Barça', g:true},
    {m:"83'", t:'GOL', team:'away', p:'Yamal', d:'Contraataque letal', g:true},
  ];

  const ratings = [
    {v:10, p:18}, {v:9, p:42}, {v:8, p:24}, {v:7, p:9}, {v:6, p:4}, {v:5, p:2}, {v:4, p:1}
  ];

  return (
    <div className="screen">
      <NavbarV2 active="matches" />

      {/* Hero with gradient */}
      <section style={{position:'relative',padding:'40px 32px 32px',overflow:'hidden',borderBottom:'1px solid var(--line)'}}>
        <div style={{position:'absolute',top:'-150px',left:'5%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,102,0.10),transparent 60%)',filter:'blur(60px)',pointerEvents:'none'}}></div>

        <div style={{maxWidth:1200,margin:'0 auto',position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:24,fontSize:12,color:'var(--text-3)'}}>
            <a style={{color:'var(--text-3)'}}>Partidos</a>
            <span>›</span>
            <a style={{color:'var(--text-3)'}}>LaLiga</a>
            <span>›</span>
            <span style={{color:'var(--text)'}}>Real Madrid vs Barcelona</span>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <span className="chip" style={{padding:'5px 12px',fontSize:10}}>LALIGA · J24</span>
            <span className="chip green" style={{padding:'5px 12px',fontSize:10}}><span className="dot live pulse"></span>EN VIVO · 65'</span>
            <span className="mono" style={{fontSize:10,color:'var(--text-3)'}}>EST. SANTIAGO BERNABÉU · 81,044 ESPECTADORES · ÁRBITRO: MATEU LAHOZ</span>
          </div>

          {/* Scoreboard */}
          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:32,padding:'32px 0'}}>
            <div style={{textAlign:'center'}}>
              <div className="ph-img" style={{width:120,height:120,borderRadius:'50%',margin:'0 auto 18px',fontSize:14}}>RM</div>
              <div className="font-outfit" style={{fontSize:32,fontWeight:900,letterSpacing:'-0.03em'}}>Real Madrid</div>
              <div className="eyebrow" style={{marginTop:6}}>LOCAL · 1º LALIGA</div>
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:18}}>
                <span className="score" style={{fontSize:120,lineHeight:1}}>2</span>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                  <span className="dot live pulse"></span>
                  <span className="mono" style={{fontSize:11,color:'#ff3b3b',letterSpacing:'0.15em',fontWeight:700}}>65'</span>
                </div>
                <span className="score text-gradient-primary" style={{fontSize:120,lineHeight:1}}>3</span>
              </div>
              <div style={{display:'flex',justifyContent:'center',gap:14,marginTop:14}}>
                <span style={{fontSize:11,color:'var(--text-3)',fontFamily:'JetBrains Mono'}}>1T: 1 - 1</span>
                <span style={{color:'var(--text-4)'}}>·</span>
                <span style={{fontSize:11,color:'var(--text-3)',fontFamily:'JetBrains Mono'}}>2T: 1 - 2</span>
              </div>
            </div>
            <div style={{textAlign:'center'}}>
              <div className="ph-img" style={{width:120,height:120,borderRadius:'50%',margin:'0 auto 18px',fontSize:14}}>FCB</div>
              <div className="font-outfit" style={{fontSize:32,fontWeight:900,letterSpacing:'-0.03em'}}>Barcelona</div>
              <div className="eyebrow" style={{marginTop:6}}>VISITANTE · 2º LALIGA</div>
            </div>
          </div>

          {/* Stat strip */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginTop:8}}>
            {[
              {l:'POSESIÓN',h:'42%',a:'58%'},
              {l:'TIROS A PUERTA',h:'4',a:'7'},
              {l:'CÓRNERS',h:'5',a:'3'},
              {l:'XG',h:'1.8',a:'2.4'},
            ].map((s,i)=>(
              <div key={i} className="glass-panel" style={{padding:'14px 18px',borderRadius:12}}>
                <div className="eyebrow" style={{marginBottom:8}}>{s.l}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span className="font-outfit tnum" style={{fontSize:22,fontWeight:900}}>{s.h}</span>
                  <span className="font-outfit tnum" style={{fontSize:22,fontWeight:900,color:'var(--primary)'}}>{s.a}</span>
                </div>
                <div className="bar" style={{marginTop:8}}>
                  <i style={{width:`${(parseFloat(s.h)/(parseFloat(s.h)+parseFloat(s.a)))*100}%`,background:'rgba(255,255,255,0.5)'}}></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body: 2 columns - Timeline + Conversation | Ratings sticky */}
      <section style={{padding:'48px 32px 80px'}}>
        <div style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:40}}>
          {/* Left column */}
          <div>
            {/* Timeline */}
            <div className="eyebrow" style={{marginBottom:18}}>CRÓNICA · MOMENTOS CLAVE</div>
            <div style={{position:'relative',paddingLeft:0,marginBottom:48}}>
              {events.map((e,i)=>(
                <div key={i} style={{display:'grid',gridTemplateColumns:'56px 1fr',gap:18,padding:'14px 0',borderBottom:i<events.length-1?'1px solid var(--line)':'none'}}>
                  <div className="mono tnum" style={{fontSize:14,fontWeight:700,color:e.g?'var(--primary)':'var(--text-3)',letterSpacing:'0.05em'}}>{e.m}</div>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                      <span className="mono" style={{fontSize:9,padding:'2px 8px',borderRadius:4,background:e.g?'rgba(0,255,102,0.15)':'rgba(255,176,32,0.15)',color:e.g?'var(--primary)':'var(--warn)',letterSpacing:'0.1em',fontWeight:700}}>{e.t}</span>
                      <span style={{fontSize:14,fontWeight:700}}>{e.p}</span>
                      <span style={{fontSize:11,color:'var(--text-3)'}}>· {e.team==='home'?'Real Madrid':'Barcelona'}</span>
                    </div>
                    <div style={{fontSize:13,color:'var(--text-2)'}}>{e.d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comments */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
              <div className="eyebrow">CONVERSACIÓN · 284 OPINIONES</div>
              <div style={{display:'flex',gap:6}}>
                <span className="chip active">Top</span>
                <span className="chip">Recientes</span>
              </div>
            </div>

            <div className="glass-panel" style={{padding:18,borderRadius:14,marginBottom:18,display:'flex',gap:14}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#00ff66,#00a846)',display:'flex',alignItems:'center',justifyContent:'center',color:'#000',fontWeight:800,fontSize:13,flexShrink:0}}>JC</div>
              <div style={{flex:1}}>
                <textarea className="field" rows={2} placeholder="Comparte tu opinión del partido…" style={{resize:'none'}}></textarea>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                  <div style={{display:'flex',gap:6}}>
                    {[6,7,8,9,10].map(n=>(
                      <button key={n} style={{width:36,height:36,borderRadius:8,background:n===9?'linear-gradient(135deg,#00ff66,#00a846)':'rgba(0,0,0,0.3)',border:'1px solid '+(n===9?'transparent':'var(--line-2)'),color:n===9?'#000':'var(--text-2)',fontWeight:800,fontSize:13,cursor:'pointer'}}>{n}</button>
                    ))}
                  </div>
                  <button className="btn primary" style={{padding:'8px 16px',fontSize:11}}>Publicar</button>
                </div>
              </div>
            </div>

            {[
              {u:'Diego Ramos',h:'12 min',r:9.4,t:'Lo dije y lo mantengo: Bellingham es Balón de Oro este año. La forma en que aparece en los grandes partidos es increíble.',l:84,c:18},
              {u:'Sofía López',h:'34 min',r:9.0,t:'Pedri jugando como en sus mejores tiempos. El centro del campo del Barça hoy fue una clase magistral. Yamal merece todos los elogios.',l:142,c:32},
              {u:'Carlos Méndez',h:'1h',r:7.5,t:'Buen partido, pero la defensa del Madrid hoy fue regalada. Courtois necesitaba un recital y ni así.',l:38,c:9},
            ].map((p,i)=>(
              <div key={i} style={{padding:'18px 0',borderTop:'1px solid var(--line)'}}>
                <div style={{display:'flex',gap:12,marginBottom:10}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#00ff66,#00a846)',display:'flex',alignItems:'center',justifyContent:'center',color:'#000',fontWeight:800,fontSize:12,flexShrink:0}}>{p.u.split(' ').map(s=>s[0]).join('')}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700}}>{p.u} <span style={{color:'var(--text-3)',fontWeight:400,fontSize:12}}>· {p.h}</span></div>
                  </div>
                  <div style={{padding:'4px 10px',background:'rgba(0,255,102,0.1)',borderRadius:6,border:'1px solid rgba(0,255,102,0.25)'}}>
                    <span className="font-outfit tnum" style={{fontSize:14,fontWeight:900,color:'var(--primary)'}}>{p.r}</span>
                  </div>
                </div>
                <p style={{fontSize:14,lineHeight:1.55,color:'var(--text)',margin:'0 0 10px'}}>{p.t}</p>
                <div style={{display:'flex',gap:18,fontSize:12,color:'var(--text-3)'}}>
                  <span>♥ {p.l}</span><span>💬 {p.c}</span><span>↗</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right sticky column */}
          <div>
            <div className="glass-panel" style={{padding:24,borderRadius:16,marginBottom:18,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-40,right:-40,width:140,height:140,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,102,0.15),transparent)',filter:'blur(20px)'}}></div>
              <div className="eyebrow" style={{marginBottom:14}}>RATING DE LA COMUNIDAD</div>
              <div style={{display:'flex',alignItems:'baseline',gap:14,marginBottom:8,position:'relative'}}>
                <span className="font-outfit tnum text-gradient-primary" style={{fontSize:80,fontWeight:900,lineHeight:1}}>9.2</span>
                <div>
                  <div style={{fontSize:13,color:'var(--text-2)',marginBottom:4}}>basado en <span style={{color:'var(--primary)',fontWeight:700}}>284 votos</span></div>
                  <div className="mono" style={{fontSize:10,color:'var(--primary-dim)',letterSpacing:'0.1em'}}>▲ TOP 3% LALIGA 24/25</div>
                </div>
              </div>
              <div style={{marginTop:18}}>
                {ratings.map(r=>(
                  <div key={r.v} style={{display:'grid',gridTemplateColumns:'24px 1fr 32px',alignItems:'center',gap:10,marginBottom:6}}>
                    <span className="mono tnum" style={{fontSize:11,color:'var(--text-3)',fontWeight:700}}>{r.v}</span>
                    <div className="bar"><i style={{width:`${r.p*2}%`}}></i></div>
                    <span className="mono tnum" style={{fontSize:10,color:'var(--text-3)'}}>{r.p}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{padding:24,borderRadius:16,marginBottom:18}}>
              <div className="eyebrow" style={{marginBottom:14}}>JUGADORES TOP DEL PARTIDO</div>
              {[
                {n:'Jude Bellingham', team:'RM', v:9.4},
                {n:'Lamine Yamal', team:'FCB', v:9.2},
                {n:'Pedri', team:'FCB', v:9.0},
                {n:'Vinicius Jr.', team:'RM', v:8.8},
              ].map((p,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderTop:i?'1px solid var(--line)':'none'}}>
                  <span className="mono" style={{fontSize:11,color:'var(--text-3)',width:18}}>0{i+1}</span>
                  <div className="ph-img" style={{width:36,height:36,borderRadius:'50%',fontSize:9}}>{p.n.split(' ').map(s=>s[0]).join('')}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700}}>{p.n}</div>
                    <div style={{fontSize:10,color:'var(--text-3)'}}>{p.team}</div>
                  </div>
                  <div className="font-outfit tnum" style={{fontSize:18,fontWeight:900,color:'var(--primary)'}}>{p.v}</div>
                </div>
              ))}
            </div>

            <button className="btn primary" style={{width:'100%',justifyContent:'center'}}>Añadir a una lista</button>
          </div>
        </div>
      </section>
    </div>
  );
};

window.MatchDetailScreenV2 = MatchDetailScreenV2;
