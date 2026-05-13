/* global React */
const { useState: useStateProf } = React;

const ProfileScreen = () => {
  const [editing, setEditing] = useStateProf(false);

  return (
    <div className="screen scrollarea" style={{ width: 1280, height: 1500, overflowY: 'auto' }}>
      <Navbar active="profile" />
      <Ticker />

      {/* Profile header */}
      <section style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center' }}>
            <Avatar name="Amir Goyri" color="#7c5cff" size={120}/>
            <div>
              <div className="eyebrow">MIEMBRO DESDE OCT 2024</div>
              <h1 className="font-display" style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-0.04em', margin: '6px 0 4px' }}>amir.goyri</h1>
              <div style={{ color: 'var(--text-2)', fontSize: 14 }}>amir@goyri.dev · México DF</div>
              <p style={{ fontSize: 14, color: 'var(--text-2)', maxWidth: 540, marginTop: 14, lineHeight: 1.5 }}>
                Madridista de toda la vida. Veo más basket del que debería. Calificando partidos con la honestidad de un narrador venido a menos.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn primary" onClick={() => setEditing(!editing)}>
                {editing ? 'Cancelar' : 'Editar perfil'}
              </button>
              <button className="btn" style={{ color: 'var(--live)', borderColor: 'rgba(255,59,59,0.3)' }}>Cerrar sesión</button>
            </div>
          </div>

          {/* Stat row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', marginTop: 32 }}>
            {[
              ['218', 'partidos vistos'],
              ['142', 'reseñas escritas'],
              ['6', 'listas creadas'],
              ['89', 'jugadores seguidos'],
              ['4.2', 'rating promedio'],
            ].map(([k,v],i)=>(
              <div key={i} style={{ background: 'var(--bg)', padding: '20px 18px' }}>
                <div className="font-display tnum" style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.04em' }}>{k}</div>
                <div className="mono" style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edit form (when active) */}
      {editing && (
        <section style={{ borderBottom: '1px solid var(--line)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 28px' }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>EDITAR PERFIL</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>NOMBRE DE USUARIO</div>
                <input className="field" defaultValue="amir.goyri"/>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>EMAIL</div>
                <input className="field" defaultValue="amir@goyri.dev"/>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>BIO</div>
                <textarea className="field" rows={3} defaultValue="Madridista de toda la vida. Veo más basket del que debería."/>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 6 }}>AVATAR</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Avatar name="Amir Goyri" color="#7c5cff" size={48}/>
                  <button className="btn">Subir imagen</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                <button className="btn" onClick={() => setEditing(false)}>Cancelar</button>
                <button className="btn primary" onClick={() => setEditing(false)}><CheckIcon size={12}/> Guardar cambios</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent activity */}
      <section style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64 }}>
            <div>
              <div className="eyebrow">ÚLTIMAS RESEÑAS</div>
              <h2 className="font-display" style={{ fontSize: 32, fontWeight: 600, margin: '8px 0 16px', letterSpacing: '-0.03em' }}>Tu bitácora</h2>
              <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.55 }}>
                Cada partido que viste deja huella. Aquí tu historial, ordenado cronológicamente.
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--line)' }}>
              {[
                { date:'OCT 22', match:'RMA 3–1 BAY', league:'UCL', stars:5, text:'Clase magistral de Vinicius. Bayern no supo defenderlo.' },
                { date:'OCT 21', match:'LAL 112–108 BOS', league:'NBA', stars:5, text:'Dončić cerró con 38. Tatum sostuvo el cuarto pero no alcanzó.' },
                { date:'OCT 20', match:'ARS 2–2 MCI', league:'PL', stars:4, text:'Empate justo. Saka jugó al límite hasta el último minuto.' },
                { date:'OCT 19', match:'KC 27–24 BUF', league:'NFL', stars:4, text:'Mahomes magia en el último drive. Bills jugó mejor en general.' },
              ].map((r,i)=>(
                <div key={i} className="row-hover" style={{ display: 'grid', gridTemplateColumns: '70px 1fr auto', gap: 16, padding: '20px 4px', borderBottom: '1px solid var(--line)', alignItems: 'start' }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', paddingTop: 4 }}>{r.date}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span className="mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em' }}>{r.league}</span>
                      <span className="font-display" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>{r.match}</span>
                      <Stars value={r.stars} size={11}/>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>"{r.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

window.ProfileScreen = ProfileScreen;
