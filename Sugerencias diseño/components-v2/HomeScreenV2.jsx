/* global React, NavbarV2 */

const HomeScreenV2 = () => (
  <div className="screen">
    <NavbarV2 active="home" />

    {/* HERO with gradient orbs (original DNA) */}
    <section style={{position:'relative',padding:'80px 32px 100px',overflow:'hidden'}}>
      {/* Gradient orbs */}
      <div style={{position:'absolute',top:'-100px',left:'10%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle, rgba(0,255,102,0.18), transparent 60%)',filter:'blur(60px)',pointerEvents:'none'}}></div>
      <div style={{position:'absolute',bottom:'-50px',right:'5%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle, rgba(0,168,70,0.12), transparent 60%)',filter:'blur(60px)',pointerEvents:'none'}}></div>

      <div style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'1.15fr 1fr',gap:64,alignItems:'center',position:'relative'}}>
        <div>
          <div className="chip green" style={{marginBottom:20}}>
            <span className="dot green"></span>
            La red social del fútbol
          </div>
          <h1 className="font-outfit" style={{fontSize:88,lineHeight:0.95,margin:'0 0 24px',letterSpacing:'-0.045em'}}>
            Vive el fútbol.<br/>
            <span className="text-gradient-primary">Comparte tu pasión.</span>
          </h1>
          <p style={{fontSize:18,lineHeight:1.6,color:'var(--text-2)',margin:'0 0 32px',maxWidth:520}}>
            Califica partidos, sigue a tus jugadores favoritos y descubre nuevas perspectivas con una comunidad que vive el fútbol como tú.
          </p>
          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            <button className="btn primary" style={{padding:'14px 28px',fontSize:14}}>
              Empezar gratis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button className="btn outline" style={{padding:'14px 28px',fontSize:14}}>
              Ver partidos en vivo
            </button>
          </div>

          <div style={{display:'flex',gap:48,marginTop:56}}>
            <div>
              <div className="font-outfit tnum text-gradient-primary" style={{fontSize:40,fontWeight:900,lineHeight:1}}>12K+</div>
              <div className="eyebrow" style={{marginTop:6}}>Aficionados activos</div>
            </div>
            <div>
              <div className="font-outfit tnum text-gradient-primary" style={{fontSize:40,fontWeight:900,lineHeight:1}}>284K</div>
              <div className="eyebrow" style={{marginTop:6}}>Reseñas publicadas</div>
            </div>
            <div>
              <div className="font-outfit tnum text-gradient-primary" style={{fontSize:40,fontWeight:900,lineHeight:1}}>96</div>
              <div className="eyebrow" style={{marginTop:6}}>Ligas cubiertas</div>
            </div>
          </div>
        </div>

        {/* Floating cards composition */}
        <div style={{position:'relative',height:560}}>
          <div className="glass-panel float-1" style={{position:'absolute',top:20,left:0,width:320,padding:18,borderRadius:18,transform:'rotate(-2deg)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <span className="chip" style={{padding:'4px 10px',fontSize:9}}>LALIGA · J24</span>
              <span className="chip green" style={{padding:'4px 10px',fontSize:9}}><span className="dot live pulse"></span>LIVE 65'</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:14,marginBottom:14}}>
              <div style={{textAlign:'center'}}>
                <div className="ph-img" style={{width:56,height:56,borderRadius:'50%',margin:'0 auto 6px'}}>RM</div>
                <div style={{fontSize:11,fontWeight:700}}>R. Madrid</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span className="score" style={{fontSize:42}}>2</span>
                <span style={{color:'var(--text-3)',fontWeight:700}}>—</span>
                <span className="score text-gradient-primary" style={{fontSize:42}}>3</span>
              </div>
              <div style={{textAlign:'center'}}>
                <div className="ph-img" style={{width:56,height:56,borderRadius:'50%',margin:'0 auto 6px'}}>FCB</div>
                <div style={{fontSize:11,fontWeight:700}}>Barcelona</div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:'rgba(0,255,102,0.08)',borderRadius:10,border:'1px solid rgba(0,255,102,0.2)'}}>
              <span style={{fontSize:11,color:'var(--text-2)'}}>Calificación promedio</span>
              <span className="font-outfit tnum" style={{fontSize:18,fontWeight:900,color:'var(--primary)'}}>9.2</span>
            </div>
          </div>

          <div className="glass-panel float-2" style={{position:'absolute',top:200,right:0,width:300,padding:18,borderRadius:18,transform:'rotate(1.5deg)'}}>
            <div style={{display:'flex',gap:12,marginBottom:12}}>
              <div className="ph-img" style={{width:48,height:48,borderRadius:12}}>JB</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>Jude Bellingham</div>
                <div className="eyebrow" style={{marginTop:2}}>MEDIO · REAL MADRID</div>
              </div>
              <div className="font-outfit tnum text-gradient-primary" style={{fontSize:30,fontWeight:900,lineHeight:1}}>9.4</div>
            </div>
            <div style={{fontSize:12,lineHeight:1.5,color:'var(--text-2)',padding:'10px 0',borderTop:'1px solid var(--line)'}}>
              "Doblete, una asistencia y dominio total del medio. Otra noche estelar para el inglés."
            </div>
            <div style={{display:'flex',gap:14,fontSize:10,color:'var(--text-3)',paddingTop:8}}>
              <span>♥ 1.2K</span><span>💬 84</span><span>↗ 23</span>
            </div>
          </div>

          <div className="glass-panel float-3" style={{position:'absolute',bottom:30,left:80,width:280,padding:16,borderRadius:18,transform:'rotate(-1deg)'}}>
            <div className="eyebrow" style={{marginBottom:10}}>TRENDING AHORA</div>
            {[
              {n:'Vinicius Jr.', t:'+2.3K menciones', v:'9.1'},
              {n:'Pedri', t:'+1.8K menciones', v:'8.7'},
              {n:'Lewandowski', t:'+1.1K menciones', v:'8.4'},
            ].map((p,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderTop:i?'1px solid var(--line)':'none'}}>
                <div className="mono" style={{fontSize:10,color:'var(--text-3)',width:14}}>0{i+1}</div>
                <div className="ph-img" style={{width:28,height:28,borderRadius:'50%',fontSize:8}}>{p.n.split(' ').map(s=>s[0]).join('')}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:700}}>{p.n}</div>
                  <div style={{fontSize:9,color:'var(--text-3)'}}>{p.t}</div>
                </div>
                <span className="font-outfit tnum" style={{fontSize:14,fontWeight:900,color:'var(--primary)'}}>{p.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* SECTION: Trending matches (cards style with gradients) */}
    <section style={{padding:'40px 32px 60px',position:'relative'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:32}}>
          <div>
            <div className="eyebrow" style={{marginBottom:8}}>EN TENDENCIA</div>
            <h2 className="font-outfit" style={{fontSize:44,margin:0,letterSpacing:'-0.04em'}}>
              Partidos que <span className="text-gradient-primary">arden hoy</span>
            </h2>
          </div>
          <a style={{color:'var(--primary)',fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>Ver todos →</a>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {[
            {l:'LALIGA',ht:'R. Madrid',at:'Barcelona',hs:2,as:3,r:9.2,c:284,live:true,m:65},
            {l:'PREMIER',ht:'Arsenal',at:'Chelsea',hs:1,as:0,r:7.8,c:142,live:true,m:42},
            {l:'CHAMPIONS',ht:'Man City',at:'PSG',hs:0,as:0,r:null,c:0,live:false,t:'19:00'},
          ].map((m,i)=>(
            <div key={i} className="glass-panel card-hover" style={{padding:24,borderRadius:20,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-50,right:-50,width:180,height:180,borderRadius:'50%',background:m.live?'radial-gradient(circle,rgba(0,255,102,0.15),transparent)':'radial-gradient(circle,rgba(255,255,255,0.04),transparent)',filter:'blur(20px)'}}></div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,position:'relative'}}>
                <span className="chip" style={{padding:'4px 10px',fontSize:10}}>{m.l}</span>
                {m.live ? (
                  <span className="chip green" style={{padding:'4px 10px',fontSize:10}}><span className="dot live pulse"></span>{m.m}'</span>
                ) : (
                  <span style={{fontSize:11,color:'var(--text-3)',fontFamily:'JetBrains Mono'}}>{m.t}</span>
                )}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:16,marginBottom:20,position:'relative'}}>
                <div style={{textAlign:'center'}}>
                  <div className="ph-img" style={{width:64,height:64,borderRadius:'50%',margin:'0 auto 10px'}}>{m.ht.split(' ').map(s=>s[0]).join('').slice(0,3)}</div>
                  <div style={{fontSize:12,fontWeight:700}}>{m.ht}</div>
                </div>
                {m.live || m.hs!==0||m.as!==0 ? (
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span className="score" style={{fontSize:48, color: m.hs>m.as?'var(--primary)':'#fff'}}>{m.hs}</span>
                    <span style={{color:'var(--text-3)',fontWeight:700}}>—</span>
                    <span className="score" style={{fontSize:48, color: m.as>m.hs?'var(--primary)':'#fff'}}>{m.as}</span>
                  </div>
                ) : (
                  <div className="font-outfit" style={{fontSize:24,color:'var(--text-3)'}}>vs</div>
                )}
                <div style={{textAlign:'center'}}>
                  <div className="ph-img" style={{width:64,height:64,borderRadius:'50%',margin:'0 auto 10px'}}>{m.at.split(' ').map(s=>s[0]).join('').slice(0,3)}</div>
                  <div style={{fontSize:12,fontWeight:700}}>{m.at}</div>
                </div>
              </div>
              {m.r ? (
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',background:'rgba(0,255,102,0.06)',borderRadius:10,border:'1px solid rgba(0,255,102,0.18)'}}>
                  <div>
                    <div className="eyebrow" style={{fontSize:9}}>RATING COMUNIDAD</div>
                    <div className="font-outfit tnum" style={{fontSize:22,fontWeight:900,color:'var(--primary)',lineHeight:1,marginTop:2}}>{m.r}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="eyebrow" style={{fontSize:9}}>OPINIONES</div>
                    <div className="font-outfit tnum" style={{fontSize:22,fontWeight:900,lineHeight:1,marginTop:2}}>{m.c}</div>
                  </div>
                </div>
              ) : (
                <button className="btn outline" style={{width:'100%',justifyContent:'center'}}>Activar recordatorio</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FEED (community + trending players) */}
    <section style={{padding:'40px 32px 80px'}}>
      <div style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:32}}>
        {/* Activity feed */}
        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
            <div>
              <div className="eyebrow" style={{marginBottom:6}}>ACTIVIDAD DE LA COMUNIDAD</div>
              <h2 className="font-outfit" style={{fontSize:32,margin:0}}>Lo que dicen <span className="text-gradient-primary">tus amigos</span></h2>
            </div>
            <div style={{display:'flex',gap:6}}>
              <span className="chip active">Siguiendo</span>
              <span className="chip">Global</span>
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {[
              {u:'Diego Ramos',h:'2h',m:'Real Madrid 2-3 Barcelona',r:9.4,t:'Una noche para el recuerdo. El medio del Barça desarmó completamente al Madrid en la segunda parte. Pedri estuvo magistral.',l:84,c:23},
              {u:'Sofía López',h:'5h',m:'Arsenal 2-1 Tottenham',r:8.6,t:'Saka decidió el derbi del norte. Atmósfera espectacular en el Emirates.',l:142,c:38},
              {u:'Carlos Méndez',h:'8h',m:'Bayern 4-2 Dortmund',r:7.9,t:'Goleada y festival ofensivo. Kane sigue facturando como si jugara en Anfield.',l:67,c:11},
            ].map((p,i)=>(
              <div key={i} className="glass-panel card-hover" style={{padding:20,borderRadius:14}}>
                <div style={{display:'flex',gap:14,marginBottom:12}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#00ff66,#00a846)',display:'flex',alignItems:'center',justifyContent:'center',color:'#000',fontWeight:800,fontSize:13,flexShrink:0}}>{p.u.split(' ').map(s=>s[0]).join('')}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700}}>{p.u} <span style={{color:'var(--text-3)',fontWeight:400,fontSize:12}}>· {p.h}</span></div>
                    <div style={{fontSize:11,color:'var(--text-3)',marginTop:2}}>calificó <span style={{color:'var(--primary)',fontWeight:600}}>{p.m}</span></div>
                  </div>
                  <div style={{padding:'6px 12px',background:'rgba(0,255,102,0.1)',borderRadius:8,border:'1px solid rgba(0,255,102,0.25)'}}>
                    <span className="font-outfit tnum" style={{fontSize:18,fontWeight:900,color:'var(--primary)'}}>{p.r}</span>
                  </div>
                </div>
                <p style={{fontSize:14,lineHeight:1.55,color:'var(--text)',margin:'0 0 12px'}}>{p.t}</p>
                <div style={{display:'flex',gap:18,fontSize:12,color:'var(--text-3)'}}>
                  <span>♥ {p.l}</span>
                  <span>💬 {p.c}</span>
                  <span>↗ Compartir</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: trending players */}
        <div style={{display:'flex',flexDirection:'column',gap:24}}>
          <div className="glass-panel" style={{padding:24,borderRadius:16,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:-40,right:-40,width:140,height:140,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,102,0.15),transparent)',filter:'blur(15px)'}}></div>
            <div className="eyebrow" style={{marginBottom:16}}>JUGADORES EN ASCENSO</div>
            {[
              {n:'Jude Bellingham',p:'MED · Real Madrid',v:9.4,d:'+0.6'},
              {n:'Lamine Yamal',p:'EXT · Barcelona',v:9.1,d:'+0.4'},
              {n:'Erling Haaland',p:'DEL · Man City',v:8.9,d:'+0.3'},
              {n:'Florian Wirtz',p:'MED · Leverkusen',v:8.7,d:'+0.5'},
              {n:'Pedri',p:'MED · Barcelona',v:8.6,d:'+0.2'},
            ].map((p,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderTop:i?'1px solid var(--line)':'none'}}>
                <span className="mono" style={{fontSize:11,color:'var(--text-3)',width:18}}>0{i+1}</span>
                <div className="ph-img" style={{width:38,height:38,borderRadius:'50%',fontSize:9}}>{p.n.split(' ').map(s=>s[0]).join('')}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>{p.n}</div>
                  <div style={{fontSize:10,color:'var(--text-3)'}}>{p.p}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="font-outfit tnum" style={{fontSize:18,fontWeight:900,color:'var(--primary)',lineHeight:1}}>{p.v}</div>
                  <div className="mono" style={{fontSize:9,color:'var(--primary-dim)',marginTop:2}}>{p.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding:24,borderRadius:16,
            background:'linear-gradient(135deg,rgba(0,255,102,0.12),rgba(0,168,70,0.04))',
            border:'1px solid rgba(0,255,102,0.3)',
            position:'relative',overflow:'hidden'
          }}>
            <div className="eyebrow" style={{marginBottom:8,color:'var(--primary)'}}>EN VIVO · COMUNIDAD</div>
            <h3 className="font-outfit" style={{fontSize:24,margin:'0 0 10px',letterSpacing:'-0.03em'}}>Únete al partido</h3>
            <p style={{fontSize:13,lineHeight:1.5,color:'var(--text-2)',margin:'0 0 16px'}}>
              <span style={{color:'var(--primary)',fontWeight:700}}>1,284 personas</span> calificando <span style={{fontWeight:700}}>Real Madrid vs Barcelona</span> ahora mismo.
            </p>
            <button className="btn primary" style={{width:'100%',justifyContent:'center'}}>Ir al partido en vivo →</button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

window.HomeScreenV2 = HomeScreenV2;
