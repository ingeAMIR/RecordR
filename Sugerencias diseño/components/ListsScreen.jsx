/* global React */
const { useState: useStateLists } = React;

const MY_LISTS = [
  { id:1, name:'Mejores Finales de UCL', items:24, glyph:'⚽', desc:'Los partidos que definieron una era en la Champions.', updated:'hace 3d', cover:['#ef0107','#dc052d','#fff','#a50044'], likes:412 },
  { id:2, name:'Game 7s del siglo', items:18, glyph:'🏀', desc:'Cada juego decisivo de las Finals desde 2000.', updated:'hace 1s', cover:['#552583','#007a33','#1d428a','#0c2340'], likes:298 },
  { id:3, name:'Comebacks imposibles', items:31, glyph:'⚡', desc:'Estaban muertos. Y resucitaron.', updated:'hace 2s', cover:['#ce3524','#1e3a8a','#ff8000','#dc052d'], likes:891 },
  { id:4, name:'Mis 2026', items:42, glyph:'★', desc:'Cada partido que vi este año.', updated:'hoy', cover:['#fff','#552583','#ef0107','#1d428a'], likes:12 },
  { id:5, name:'Para ver con mi viejo', items:7, glyph:'📼', desc:'Clásicos para revisitar juntos en navidad.', updated:'hace 1m', cover:['#005a9c','#0c2340','#cfd5e6','#7a0a1c'], likes:3 },
  { id:6, name:'Vinicius highlight reel', items:16, glyph:'🎯', desc:'Solo partidos donde fue MVP de facto.', updated:'hace 4d', cover:['#fff','#cfd5e6','#fff','#cfd5e6'], likes:55 },
];

const ListsScreen = () => {
  const [showModal, setShowModal] = useStateLists(false);
  const [tab, setTab] = useStateLists('mine');
  const [selectedIcon, setSelectedIcon] = useStateLists('★');

  return (
    <div className="screen scrollarea" style={{ width: 1280, height: 1500, overflowY: 'auto', position: 'relative' }}>
      <Navbar active="lists" />
      <Ticker />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px 24px' }}>
        <div className="eyebrow">COLECCIONES · CURADAS POR TI</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
          <h1 className="font-display" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', margin: 0 }}>Listas</h1>
          <button className="btn primary" onClick={() => setShowModal(true)}>
            <PlusIcon size={14}/> Nueva lista
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', gap: 4 }}>
          {[
            { k:'mine', label:'Mis listas', n:6 },
            { k:'saved', label:'Guardadas', n:14 },
            { k:'community', label:'De la comunidad' },
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

      {/* Grid */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {MY_LISTS.map(l => (
            <div key={l.id} className="card-hover" style={{ border: '1px solid var(--line)', background: 'var(--bg-elev)', overflow: 'hidden', cursor: 'pointer' }}>
              {/* Cover stack — 4 colored stripes */}
              <div style={{ height: 120, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--bg)' }}>
                {l.cover.map((c,i)=>(
                  <div key={i} style={{ background: c, position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)' }}/>
                  </div>
                ))}
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 18 }}>{l.glyph}</span>
                      <span className="mono tnum" style={{ fontSize: 10, color: 'var(--primary)', letterSpacing: '0.1em' }}>{l.items} PARTIDOS</span>
                    </div>
                    <h3 className="font-display" style={{ fontSize: 20, fontWeight: 600, margin: '4px 0 8px', letterSpacing: '-0.02em' }}>{l.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{l.desc}</p>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4 }}>
                    <TrashIcon size={14}/>
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>ACTUALIZADA {l.updated}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-2)', fontSize: 12 }}>
                    <HeartIcon size={11} filled/> <span className="tnum">{l.likes}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* New list ghost card */}
          <button onClick={() => setShowModal(true)} style={{
            border: '1px dashed var(--line-2)', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 12, padding: 40,
            color: 'var(--text-3)', cursor: 'pointer', fontFamily: 'inherit',
            minHeight: 280,
          }}>
            <span style={{ width: 40, height: 40, borderRadius: 999, border: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusIcon size={16}/>
            </span>
            <span className="font-display" style={{ fontSize: 16, fontWeight: 500 }}>Nueva colección</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em' }}>Cmd+N</span>
          </button>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(7,9,11,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, backdropFilter: 'blur(8px)',
        }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 480, background: 'var(--bg-elev)',
            border: '1px solid var(--line-2)', padding: 32, borderRadius: 8,
          }}>
            <div className="eyebrow">NUEVA COLECCIÓN</div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 600, margin: '8px 0 24px', letterSpacing: '-0.03em' }}>Crear lista</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>NOMBRE</div>
                <input className="field" placeholder="Ej. Mejores finales de UCL"/>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>DESCRIPCIÓN</div>
                <textarea className="field" rows={2} placeholder="¿De qué trata esta lista?"/>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 8 }}>ICONO</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['★','⚽','🏀','🏈','⚾','🏎','🎯','⚡','📼','🔥'].map(g => (
                    <button key={g} onClick={() => setSelectedIcon(g)} style={{
                      width: 36, height: 36, borderRadius: 4, fontSize: 16,
                      background: selectedIcon === g ? 'var(--primary)' : 'transparent',
                      border: `1px solid ${selectedIcon === g ? 'var(--primary)' : 'var(--line-2)'}`,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 8 }}>VISIBILIDAD</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="chip active" style={{ cursor: 'pointer' }}>Pública</button>
                  <button className="chip" style={{ cursor: 'pointer' }}>Privada</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 28 }}>
              <button className="btn" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn primary" onClick={() => setShowModal(false)}>Crear lista</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

window.ListsScreen = ListsScreen;
