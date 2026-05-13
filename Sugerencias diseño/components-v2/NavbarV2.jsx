/* global React */
const { useState } = React;

const Logo = ({size=28}) => (
  <div style={{display:'flex',alignItems:'center',gap:10}}>
    <div style={{
      width:size,height:size,borderRadius:8,
      background:'linear-gradient(135deg,#00ff66,#00a846)',
      display:'flex',alignItems:'center',justifyContent:'center',
      boxShadow:'0 0 14px rgba(0,255,102,0.4)',
      fontFamily:'Outfit',fontWeight:900,color:'#000',fontSize:size*0.55,
      letterSpacing:'-0.04em'
    }}>R</div>
    <span style={{fontFamily:'Outfit',fontWeight:900,letterSpacing:'-0.04em',fontSize:size*0.7}}>
      Record<span style={{color:'#00ff66'}}>R</span>
    </span>
  </div>
);

/* ---------- NAVBAR + TICKER ---------- */
const NavbarV2 = ({active='home'}) => {
  const items = [
    {id:'home', label:'Inicio'},
    {id:'matches', label:'Partidos'},
    {id:'players', label:'Jugadores'},
    {id:'lists', label:'Listas'},
  ];
  return (
    <header style={{
      position:'sticky',top:0,zIndex:50,
      background:'rgba(7,9,11,0.85)',
      backdropFilter:'blur(20px) saturate(150%)',
      borderBottom:'1px solid var(--line-2)'
    }}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'18px 32px',display:'flex',alignItems:'center',gap:36}}>
        <Logo />
        <nav style={{display:'flex',gap:6,marginLeft:24}}>
          {items.map(i => (
            <a key={i.id} style={{
              padding:'9px 18px',borderRadius:999,
              fontSize:13,fontWeight:600,letterSpacing:'-0.01em',
              color: active===i.id ? '#000' : 'var(--text-2)',
              background: active===i.id ? 'linear-gradient(135deg,#00ff66,#00d254)' : 'transparent',
              boxShadow: active===i.id ? '0 4px 12px rgba(0,255,102,0.3)' : 'none',
              cursor:'pointer'
            }}>{i.label}</a>
          ))}
        </nav>
        <div style={{flex:1}}></div>
        <div style={{
          display:'flex',alignItems:'center',gap:10,
          padding:'9px 16px',borderRadius:999,
          background:'rgba(0,0,0,0.4)',border:'1px solid var(--line-2)',
          color:'var(--text-3)',fontSize:13,minWidth:280
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Buscar partidos, jugadores, ligas…</span>
          <span style={{marginLeft:'auto',fontFamily:'JetBrains Mono',fontSize:10,padding:'2px 6px',background:'rgba(255,255,255,0.06)',borderRadius:4,color:'var(--text-3)'}}>⌘K</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <button style={{background:'none',border:'none',color:'var(--text-2)',cursor:'pointer'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <div style={{
            width:36,height:36,borderRadius:999,
            background:'linear-gradient(135deg,#00ff66,#00a846)',
            display:'flex',alignItems:'center',justifyContent:'center',
            color:'#000',fontWeight:800,fontSize:13,
            boxShadow:'0 0 12px rgba(0,255,102,0.35)'
          }}>JC</div>
        </div>
      </div>

      {/* Bloomberg-style live ticker */}
      <div style={{
        background:'rgba(0,0,0,0.4)',
        borderTop:'1px solid var(--line)',
        borderBottom:'1px solid var(--line)',
        overflow:'hidden',position:'relative',height:38,display:'flex',alignItems:'center'
      }}>
        <div style={{
          position:'absolute',left:0,top:0,bottom:0,zIndex:2,
          padding:'0 14px',display:'flex',alignItems:'center',gap:8,
          background:'#07090b',
          borderRight:'1px solid var(--line-2)'
        }}>
          <span className="dot live pulse"></span>
          <span className="mono" style={{fontSize:10,letterSpacing:'0.18em',color:'#ff3b3b',fontWeight:700}}>LIVE</span>
        </div>
        <div className="ticker mono" style={{paddingLeft:90,fontSize:12,letterSpacing:'0.04em'}}>
          {[...Array(2)].map((_,i)=>(
            <React.Fragment key={i}>
              <span><span style={{color:'var(--text-3)'}}>LALIGA · 65'</span> &nbsp; REAL MADRID <span className="tnum" style={{color:'#fff',fontWeight:700}}>2</span> – <span className="tnum" style={{color:'var(--primary)',fontWeight:700}}>3</span> BARCELONA</span>
              <span style={{color:'var(--text-4)'}}>•</span>
              <span><span style={{color:'var(--text-3)'}}>PREMIER · 42'</span> &nbsp; ARSENAL <span className="tnum" style={{color:'var(--primary)',fontWeight:700}}>1</span> – <span className="tnum">0</span> CHELSEA</span>
              <span style={{color:'var(--text-4)'}}>•</span>
              <span><span style={{color:'var(--text-3)'}}>SERIE A · FT</span> &nbsp; INTER <span className="tnum">2</span> – <span className="tnum" style={{color:'var(--primary)',fontWeight:700}}>4</span> JUVENTUS</span>
              <span style={{color:'var(--text-4)'}}>•</span>
              <span><span style={{color:'var(--text-3)'}}>BUNDESLIGA · 78'</span> &nbsp; B. MUNICH <span className="tnum" style={{color:'var(--primary)',fontWeight:700}}>3</span> – <span className="tnum">1</span> DORTMUND</span>
              <span style={{color:'var(--text-4)'}}>•</span>
              <span><span style={{color:'var(--text-3)'}}>UCL · 19:00</span> &nbsp; MAN CITY vs PSG</span>
              <span style={{color:'var(--text-4)'}}>•</span>
              <span><span style={{color:'var(--text-3)'}}>RATINGS HOY</span> &nbsp; <span style={{color:'var(--primary)'}}>▲</span> BELLINGHAM <span className="tnum">9.4</span> · <span style={{color:'var(--primary)'}}>▲</span> VINICIUS <span className="tnum">9.1</span> · <span style={{color:'#ff3b3b'}}>▼</span> COURTOIS <span className="tnum">4.2</span></span>
              <span style={{color:'var(--text-4)'}}>•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </header>
  );
};

window.NavbarV2 = NavbarV2;
window.LogoV2 = Logo;
