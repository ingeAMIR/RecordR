/* global React, NavbarV2 */

const PlayersScreenV2 = () => {
  const players = [
    {n:'Jude Bellingham',pos:'MED',club:'Real Madrid',country:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',num:5,v:9.4,votes:1240,trend:'+0.6'},
    {n:'Lamine Yamal',pos:'EXT',club:'Barcelona',country:'🇪🇸',num:19,v:9.1,votes:984,trend:'+0.4'},
    {n:'Vinicius Jr.',pos:'EXT',club:'Real Madrid',country:'🇧🇷',num:7,v:9.0,votes:1180,trend:'+0.2'},
    {n:'Erling Haaland',pos:'DEL',club:'Man City',country:'🇳🇴',num:9,v:8.9,votes:1320,trend:'+0.3'},
    {n:'Pedri',pos:'MED',club:'Barcelona',country:'🇪🇸',num:8,v:8.7,votes:867,trend:'+0.5'},
    {n:'Florian Wirtz',pos:'MED',club:'Leverkusen',country:'🇩🇪',num:10,v:8.7,votes:612,trend:'+0.4'},
    {n:'Kylian Mbappé',pos:'DEL',club:'Real Madrid',country:'🇫🇷',num:9,v:8.6,votes:1456,trend:'-0.1'},
    {n:'Rodri',pos:'MED',club:'Man City',country:'🇪🇸',num:16,v:8.5,votes:1023,trend:'+0.2'},
  ];

  const posColor = {DEL:'#ff6b6b', MED:'#ffd93d', EXT:'#00ff66', DEF:'#6bb3ff', POR:'#c084fc'};

  return (
    <div className="screen">
      <NavbarV2 active="players" />

      <section style={{position:'relative',padding:'48px 32px 32px',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-100px',left:'10%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,102,0.10),transparent 60%)',filter:'blur(50px)',pointerEvents:'none'}}></div>
        <div style={{maxWidth:1200,margin:'0 auto',position:'relative'}}>
          <div className="eyebrow" style={{marginBottom:10}}>RANKING · 12,847 JUGADORES</div>
          <h1 className="font-outfit" style={{fontSize:64,margin:'0 0 16px',letterSpacing:'-0.045em'}}>
            Los <span className="text-gradient-primary">mejores</span> del momento
          </h1>
          <p style={{fontSize:16,color:'var(--text-2)',maxWidth:600,margin:'0 0 28px'}}>
            Ranking calculado en tiempo real a partir de las calificaciones de la comunidad.
          </p>

          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20}}>
            <span className="chip active">Todos</span>
            <span className="chip">Porteros</span>
            <span className="chip">Defensas</span>
            <span className="chip">Mediocampistas</span>
            <span className="chip">Delanteros</span>
            <span className="chip">·</span>
            <span className="chip">LaLiga</span>
            <span className="chip">Premier</span>
            <span className="chip">Champions</span>
          </div>

          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <input className="field" placeholder="Buscar jugador o club…" style={{flex:1,maxWidth:380}} />
            <select className="field" style={{maxWidth:200}}><option>Mejor calificados</option><option>Más votados</option><option>En ascenso</option></select>
          </div>
        </div>
      </section>

      {/* Players grid */}
      <section style={{padding:'24px 32px 80px'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
            {players.map((p,i)=>(
              <div key={i} className="glass-panel card-hover" style={{padding:0,borderRadius:18,overflow:'hidden',position:'relative'}}>
                {/* Rank ribbon */}
                <div style={{position:'absolute',top:14,left:14,zIndex:2}}>
                  <span className="mono" style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)',border:'1px solid var(--line-2)',color: i<3?'var(--primary)':'var(--text-2)'}}>#{i+1}</span>
                </div>
                <div style={{position:'absolute',top:14,right:14,zIndex:2}}>
                  <span className="mono" style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:'rgba(0,0,0,0.6)',color:posColor[p.pos]||'#fff',border:`1px solid ${posColor[p.pos]||'#fff'}55`}}>{p.pos}</span>
                </div>

                {/* Photo area with gradient */}
                <div style={{
                  height:200,position:'relative',
                  background:`linear-gradient(180deg, ${posColor[p.pos]}22 0%, transparent 70%), repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 8px, transparent 8px 16px), rgba(22,26,32,0.8)`,
                  display:'flex',alignItems:'flex-end',justifyContent:'center',
                  borderBottom:'1px solid var(--line)'
                }}>
                  <div style={{
                    fontFamily:'Outfit',fontWeight:900,fontSize:120,color:'rgba(255,255,255,0.05)',
                    position:'absolute',bottom:-20,letterSpacing:'-0.06em',lineHeight:1
                  }} className="tnum">{p.num}</div>
                  <div style={{
                    width:130,height:130,borderRadius:'50%',
                    background:'rgba(7,9,11,0.8)',border:'2px solid var(--line-2)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'JetBrains Mono',fontSize:11,color:'var(--text-3)',letterSpacing:'0.1em',
                    position:'relative',zIndex:1,marginBottom:-10
                  }}>{p.n.split(' ').map(s=>s[0]).join('')}</div>
                </div>

                <div style={{padding:'24px 18px 18px'}}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:14}}>
                    <div>
                      <div style={{fontSize:15,fontWeight:800,letterSpacing:'-0.01em',lineHeight:1.2}}>{p.n}</div>
                      <div style={{fontSize:11,color:'var(--text-3)',marginTop:3,display:'flex',alignItems:'center',gap:6}}>
                        <span>{p.country}</span>
                        <span>{p.club}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',borderRadius:10,background:'rgba(0,255,102,0.06)',border:'1px solid rgba(0,255,102,0.18)'}}>
                    <div>
                      <div className="eyebrow" style={{fontSize:9}}>RATING</div>
                      <div className="font-outfit tnum" style={{fontSize:24,fontWeight:900,color:'var(--primary)',lineHeight:1,marginTop:2}}>{p.v}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="eyebrow" style={{fontSize:9}}>VOTOS</div>
                      <div className="font-outfit tnum" style={{fontSize:14,fontWeight:800,lineHeight:1,marginTop:4}}>{p.votes}</div>
                      <div className="mono" style={{fontSize:9,color: p.trend.startsWith('-')?'#ff3b3b':'var(--primary-dim)',marginTop:3}}>{p.trend.startsWith('-')?'▼':'▲'} {p.trend}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{display:'flex',justifyContent:'center',marginTop:36}}>
            <button className="btn outline">Ver ranking completo</button>
          </div>
        </div>
      </section>
    </div>
  );
};

window.PlayersScreenV2 = PlayersScreenV2;
