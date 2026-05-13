/* global React, NavbarV2 */

const MatchesScreenV2 = () => {
  const matches = [
    {l:'LALIGA',j:'J24',ht:'Real Madrid',at:'Barcelona',hs:2,as:3,r:9.2,c:284,live:true,m:65,h:'El Clásico se decide en el Bernabéu'},
    {l:'PREMIER',j:'J23',ht:'Arsenal',at:'Chelsea',hs:1,as:0,r:7.8,c:142,live:true,m:42,h:'Saka encuentra el primero del derby'},
    {l:'SERIE A',j:'J22',ht:'Inter',at:'Juventus',hs:2,as:4,r:8.9,c:198,live:false,h:'Vlahovic firma triplete histórico en Milán'},
    {l:'BUNDESLIGA',j:'J20',ht:'Bayern',at:'Dortmund',hs:3,as:1,r:8.1,c:167,live:true,m:78,h:'Kane sigue imparable en su primera Klassiker'},
    {l:'LIGUE 1',j:'J21',ht:'PSG',at:'Marsella',hs:0,as:0,r:null,c:0,live:false,t:'21:00',h:'El Clásico francés en el Parc des Princes'},
    {l:'CHAMPIONS',j:'OCT',ht:'Man City',at:'PSG',hs:0,as:0,r:null,c:0,live:false,t:'19:00',h:'Choque de candidatos en el Etihad'},
  ];

  return (
    <div className="screen">
      <NavbarV2 active="matches" />

      {/* Hero header with gradient */}
      <section style={{position:'relative',padding:'48px 32px 32px',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-100px',right:'10%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,102,0.12),transparent 60%)',filter:'blur(50px)',pointerEvents:'none'}}></div>
        <div style={{maxWidth:1200,margin:'0 auto',position:'relative'}}>
          <div className="eyebrow" style={{marginBottom:10}}>HOY · 6 PARTIDOS · 4 EN VIVO</div>
          <h1 className="font-outfit" style={{fontSize:64,margin:'0 0 16px',letterSpacing:'-0.045em'}}>
            Todos los <span className="text-gradient-primary">partidos</span>
          </h1>
          <p style={{fontSize:16,color:'var(--text-2)',maxWidth:600,margin:'0 0 28px'}}>
            Descubre, califica y comenta los partidos de las principales ligas del mundo.
          </p>

          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:24}}>
            <span className="chip active">Todos · 2,847</span>
            <span className="chip">En vivo · 4</span>
            <span className="chip">Hoy · 12</span>
            <span className="chip">Esta semana · 86</span>
            <span className="chip">LaLiga</span>
            <span className="chip">Premier</span>
            <span className="chip">Champions</span>
            <span className="chip">Serie A</span>
          </div>

          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <input className="field" placeholder="Buscar partido o equipo…" style={{flex:1,maxWidth:380}} />
            <select className="field" style={{maxWidth:180}}><option>Más recientes</option><option>Mejor calificados</option><option>Más comentados</option></select>
            <div style={{flex:1}}></div>
            <span className="eyebrow">VISTA</span>
            <div style={{display:'flex',gap:4,padding:4,background:'rgba(0,0,0,0.4)',borderRadius:8,border:'1px solid var(--line-2)'}}>
              <button style={{padding:'6px 12px',borderRadius:6,background:'linear-gradient(135deg,#00ff66,#00a846)',color:'#000',border:'none',fontWeight:700,fontSize:11,cursor:'pointer'}}>GRID</button>
              <button style={{padding:'6px 12px',borderRadius:6,background:'transparent',color:'var(--text-3)',border:'none',fontWeight:700,fontSize:11,cursor:'pointer'}}>LISTA</button>
            </div>
          </div>
        </div>
      </section>

      {/* Match cards grid */}
      <section style={{padding:'24px 32px 80px'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {matches.map((m,i)=>(
              <div key={i} className="glass-panel card-hover" style={{padding:24,borderRadius:18,position:'relative',overflow:'hidden'}}>
                {m.live && <div style={{position:'absolute',top:-50,right:-50,width:180,height:180,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,102,0.18),transparent)',filter:'blur(20px)'}}></div>}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,position:'relative'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span className="chip" style={{padding:'4px 10px',fontSize:9}}>{m.l}</span>
                    <span style={{fontSize:10,color:'var(--text-3)',fontFamily:'JetBrains Mono'}}>{m.j}</span>
                  </div>
                  {m.live ? (
                    <span className="chip green" style={{padding:'4px 10px',fontSize:10}}><span className="dot live pulse"></span>LIVE {m.m}'</span>
                  ) : m.t ? (
                    <span style={{fontSize:11,color:'var(--text-3)',fontFamily:'JetBrains Mono'}}>HOY {m.t}</span>
                  ) : (
                    <span style={{fontSize:10,color:'var(--text-3)',fontFamily:'JetBrains Mono'}}>FT · AYER</span>
                  )}
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:14,marginBottom:18,position:'relative'}}>
                  <div style={{textAlign:'center'}}>
                    <div className="ph-img" style={{width:60,height:60,borderRadius:'50%',margin:'0 auto 8px',fontSize:10}}>{m.ht.split(' ').map(s=>s[0]).join('').slice(0,3)}</div>
                    <div style={{fontSize:12,fontWeight:700}}>{m.ht}</div>
                  </div>
                  {m.r || m.live ? (
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span className="score" style={{fontSize:42, color: m.hs>m.as?'var(--primary)':'#fff'}}>{m.hs}</span>
                      <span style={{color:'var(--text-3)',fontWeight:700}}>—</span>
                      <span className="score" style={{fontSize:42, color: m.as>m.hs?'var(--primary)':'#fff'}}>{m.as}</span>
                    </div>
                  ) : (
                    <div className="font-outfit" style={{fontSize:22,color:'var(--text-3)'}}>vs</div>
                  )}
                  <div style={{textAlign:'center'}}>
                    <div className="ph-img" style={{width:60,height:60,borderRadius:'50%',margin:'0 auto 8px',fontSize:10}}>{m.at.split(' ').map(s=>s[0]).join('').slice(0,3)}</div>
                    <div style={{fontSize:12,fontWeight:700}}>{m.at}</div>
                  </div>
                </div>

                <p style={{fontSize:12,color:'var(--text-2)',lineHeight:1.5,margin:'0 0 16px',minHeight:36}}>{m.h}</p>

                {m.r ? (
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{flex:1,padding:'10px 12px',background:'rgba(0,255,102,0.06)',borderRadius:10,border:'1px solid rgba(0,255,102,0.18)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:10,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.08em'}}>Rating</span>
                      <span className="font-outfit tnum" style={{fontSize:18,fontWeight:900,color:'var(--primary)'}}>{m.r}</span>
                    </div>
                    <div style={{flex:1,padding:'10px 12px',background:'rgba(0,0,0,0.3)',borderRadius:10,border:'1px solid var(--line-2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:10,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.08em'}}>Reviews</span>
                      <span className="font-outfit tnum" style={{fontSize:18,fontWeight:900}}>{m.c}</span>
                    </div>
                  </div>
                ) : (
                  <button className="btn outline" style={{width:'100%',justifyContent:'center',fontSize:11}}>Activar recordatorio</button>
                )}
              </div>
            ))}
          </div>

          <div style={{display:'flex',justifyContent:'center',marginTop:32}}>
            <button className="btn outline">Cargar más partidos</button>
          </div>
        </div>
      </section>
    </div>
  );
};

window.MatchesScreenV2 = MatchesScreenV2;
