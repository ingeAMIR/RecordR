/* global React */
// Shared UI atoms for RecordR redesign

const Logo = ({ size = 28 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{
      width: size, height: size, borderRadius: 6,
      background: 'var(--primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#001a0a', fontFamily: 'Space Grotesk', fontWeight: 700,
      fontSize: size * 0.55, letterSpacing: '-0.04em',
      boxShadow: '0 0 0 1px rgba(0,255,102,0.5), 0 0 20px rgba(0,255,102,0.15)'
    }}>R</div>
    <span className="font-display" style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.03em' }}>
      record<span style={{ color: 'var(--primary)' }}>R</span>
    </span>
  </div>
);

const Ticker = () => {
  const items = [
    { l: 'NBA', a: 'LAL', as: 112, b: 'BOS', bs: 108, t: 'FT' },
    { l: 'PL',  a: 'ARS', as: 2, b: 'MCI', bs: 2, t: '78\'', live: true },
    { l: 'LL',  a: 'RMA', as: 3, b: 'BAR', bs: 1, t: 'FT' },
    { l: 'NFL', a: 'KC',  as: 27, b: 'BUF', bs: 24, t: 'FT' },
    { l: 'UCL', a: 'PSG', as: 1, b: 'BAY', bs: 0, t: '54\'', live: true },
    { l: 'MLB', a: 'NYY', as: 5, b: 'LAD', bs: 4, t: 'FT' },
    { l: 'F1',  a: 'VER', as: '1st', b: 'NOR', bs: '+3.2s', t: 'LAP 41', live: true },
    { l: 'NHL', a: 'TOR', as: 3, b: 'MTL', bs: 2, t: 'FT' },
  ];
  const Item = ({ it }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
      <span className="mono" style={{ color: 'var(--text-3)', fontSize: 10, letterSpacing: '0.1em' }}>{it.l}</span>
      <span style={{ color: 'var(--text-2)' }}>{it.a}</span>
      <span className="tnum font-display" style={{ fontWeight: 700, color: '#fff' }}>{it.as}</span>
      <span style={{ color: 'var(--text-3)' }}>·</span>
      <span className="tnum font-display" style={{ fontWeight: 700, color: '#fff' }}>{it.bs}</span>
      <span style={{ color: 'var(--text-2)' }}>{it.b}</span>
      <span className="mono" style={{
        color: it.live ? 'var(--live)' : 'var(--text-3)', fontSize: 10,
      }}>
        {it.live && <span className="dot live pulse" style={{ marginRight: 6, verticalAlign: 'middle' }}></span>}
        {it.t}
      </span>
    </span>
  );
  return (
    <div style={{
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      height: 36, overflow: 'hidden',
      display: 'flex', alignItems: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{
        padding: '0 14px', height: '100%', display: 'flex', alignItems: 'center',
        borderRight: '1px solid var(--line)', flexShrink: 0,
      }}>
        <span className="dot live pulse" style={{ marginRight: 8 }}></span>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--text-2)' }}>LIVE</span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div className="ticker" style={{ paddingLeft: 24 }}>
          {[...items, ...items].map((it, i) => <Item key={i} it={it} />)}
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ active = 'home' }) => {
  const links = [
    { id: 'matches', label: 'Partidos' },
    { id: 'players', label: 'Jugadores' },
    { id: 'lists', label: 'Listas' },
  ];
  return (
    <header style={{
      borderBottom: '1px solid var(--line)',
      background: 'rgba(7,9,11,0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '14px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <Logo />
          <nav style={{ display: 'flex', gap: 24 }}>
            {links.map(l => (
              <a key={l.id} style={{
                fontSize: 13, fontWeight: 500,
                color: active === l.id ? 'var(--text)' : 'var(--text-2)',
                textDecoration: 'none',
                position: 'relative', paddingBottom: 2,
                borderBottom: active === l.id ? '1px solid var(--primary)' : '1px solid transparent',
              }}>{l.label}</a>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 12px', borderRadius: 6, border: '1px solid var(--line-2)',
            color: 'var(--text-3)', fontSize: 12, minWidth: 220,
          }}>
            <SearchIcon size={14} />
            <span>Buscar partidos, jugadores...</span>
            <span className="mono" style={{
              marginLeft: 'auto', padding: '1px 5px', border: '1px solid var(--line-2)',
              borderRadius: 3, fontSize: 10, color: 'var(--text-3)',
            }}>⌘K</span>
          </div>
          <button className="btn ghost" style={{ padding: '8px 14px', fontSize: 12 }}>Iniciar Sesión</button>
          <button className="btn primary" style={{ padding: '8px 14px', fontSize: 12 }}>Registrarse</button>
        </div>
      </div>
    </header>
  );
};

// Tiny inline icons (avoid bootstrap-icons dep)
const Icon = ({ d, size = 14, stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {d}
  </svg>
);
const SearchIcon = (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>}/>;
const StarIcon = ({ filled, ...p }) => (
  <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill={filled?'currentColor':'none'} stroke="currentColor" strokeWidth="1.4">
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>
  </svg>
);
const ArrowR = (p) => <Icon {...p} d={<><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></>}/>;
const PlusIcon = (p) => <Icon {...p} d={<><path d="M12 5v14"/><path d="M5 12h14"/></>}/>;
const FireIcon = (p) => <Icon {...p} d={<path d="M12 2c1 4 4 5 4 9a4 4 0 1 1-8 0c0-1.5.5-2.5 1-3 0 1.5.5 2 1 2 0-3 1-5 2-8z"/>}/>;
const ChatIcon = (p) => <Icon {...p} d={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>}/>;
const HeartIcon = ({filled,...p}) => (
  <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill={filled?'currentColor':'none'} stroke="currentColor" strokeWidth="1.4">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const ClockIcon = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>}/>;
const PinIcon = (p) => <Icon {...p} d={<><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></>}/>;
const TrashIcon = (p) => <Icon {...p} d={<><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></>}/>;
const BookmarkIcon = (p) => <Icon {...p} d={<path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>}/>;
const SendIcon = (p) => <Icon {...p} d={<><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></>}/>;
const CheckIcon = (p) => <Icon {...p} d={<path d="m5 13 4 4L19 7"/>}/>;
const ReplyIcon = (p) => <Icon {...p} d={<><path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></>}/>;
const FilterIcon = (p) => <Icon {...p} d={<path d="M3 6h18M6 12h12M10 18h4"/>}/>;
const CalIcon = (p) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>}/>;

const Stars = ({ value, size = 12 }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span style={{ display: 'inline-flex', gap: 1, color: 'var(--primary)' }}>
      {[1,2,3,4,5].map(i => (
        <StarIcon key={i} size={size} filled={i <= full || (i === full+1 && half)} />
      ))}
    </span>
  );
};

const Avatar = ({ name, color, size = 32 }) => {
  const initials = name.split(' ').map(s => s[0]).slice(0,2).join('');
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: color || 'rgba(255,255,255,0.06)',
      border: '1px solid var(--line-2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.36, fontWeight: 600,
      flexShrink: 0,
    }}>{initials}</div>
  );
};

// Tiny crest/badge for teams (svg shield with colored letters)
const TeamCrest = ({ abbr, color1 = '#1a4cff', color2 = '#0a2ab8', size = 32 }) => (
  <div style={{
    width: size, height: size, flexShrink: 0,
    borderRadius: 6,
    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700,
    fontSize: size * 0.36, letterSpacing: '-0.02em',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.25)',
  }}>{abbr}</div>
);

Object.assign(window, {
  Logo, Ticker, Navbar, Stars, Avatar, TeamCrest,
  SearchIcon, StarIcon, ArrowR, PlusIcon, FireIcon, ChatIcon, HeartIcon,
  ClockIcon, PinIcon, TrashIcon, BookmarkIcon, SendIcon, CheckIcon, ReplyIcon, FilterIcon, CalIcon,
});
