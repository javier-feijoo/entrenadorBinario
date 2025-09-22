// ===============================
// js/views/stats.js (por modo) — Dec→Bin y Bin→Dec
// ===============================
import { store, LEVELS, defaultState } from '../store.js';
import { $, announce, refreshHeader } from '../ui.js';

function defMode() {
  return {
    levelIdx: 0, progress: 0, score: 0, streak: 0, bestStreak: 0,
    stats: { attempts: 0, hits: 0, miss: 0 }
  };
}
function hydrateMode(m) {
  const d = defMode();
  const x = m || {};
  return {
    levelIdx: x.levelIdx ?? d.levelIdx,
    progress: x.progress ?? d.progress,
    score: x.score ?? d.score,
    streak: x.streak ?? d.streak,
    bestStreak: x.bestStreak ?? d.bestStreak,
    stats: {
      attempts: x.stats?.attempts ?? 0,
      hits:     x.stats?.hits ?? 0,
      miss:     x.stats?.miss ?? 0
    }
  };
}
function acc(m) {
  const a = m.stats.attempts || 0;
  const h = m.stats.hits || 0;
  return a ? Math.round((h / a) * 100) : 0;
}

export async function renderStats(root){
  const s = store.load();
  const d = hydrateMode(s.modes?.dec2bin);
  const b = hydrateMode(s.modes?.bin2dec);
  const Ld = LEVELS[d.levelIdx] || LEVELS[0];
  const Lb = LEVELS[b.levelIdx] || LEVELS[0];

  root.innerHTML = `
  <section class="view-card">
    <div class="card pad">
      <h2 class="section-title">Estadísticas</h2>

      <div class="grid cols-2" style="gap:1rem">
        <!-- DEC → BIN -->
        <div class="card soft"><div class="pad">
          <h3 class="section-title" style="font-size:1.1rem">Decimal → Binario</h3>
          <ul class="stats-list">
            <li>Nivel: <strong>${Ld.name}</strong> · Progreso: <strong>${d.progress}/10</strong></li>
            <li>Puntos: <strong>${d.score}</strong> · Racha: <strong>${d.streak}</strong> · Mejor racha: <strong>${d.bestStreak}</strong></li>
            <li>Intentos: <strong>${d.stats.attempts}</strong> · Aciertos: <strong>${d.stats.hits}</strong> · Fallos: <strong>${d.stats.miss}</strong></li>
            <li>Efectividad: <strong>${acc(d)}%</strong></li>
          </ul>
          <div class="form-row wrap">
            <button class="btn" id="resetDec2Bin">Reiniciar modo Dec→Bin</button>
          </div>
        </div></div>

        <!-- BIN → DEC -->
        <div class="card soft"><div class="pad">
          <h3 class="section-title" style="font-size:1.1rem">Binario → Decimal</h3>
          <ul class="stats-list">
            <li>Nivel: <strong>${Lb.name}</strong> · Progreso: <strong>${b.progress}/10</strong></li>
            <li>Puntos: <strong>${b.score}</strong> · Racha: <strong>${b.streak}</strong> · Mejor racha: <strong>${b.bestStreak}</strong></li>
            <li>Intentos: <strong>${b.stats.attempts}</strong> · Aciertos: <strong>${b.stats.hits}</strong> · Fallos: <strong>${b.stats.miss}</strong></li>
            <li>Efectividad: <strong>${acc(b)}%</strong></li>
          </ul>
          <div class="form-row wrap">
            <button class="btn" id="resetBin2Dec">Reiniciar modo Bin→Dec</button>
          </div>
        </div></div>
      </div>

      <hr style="border-color:var(--border);opacity:.35;margin:1rem 0">

      <div class="form-row wrap">
        <button class="btn ghost" id="goMenu">Volver al menú</button>
        <button class="btn bad" id="resetAll">Borrar TODO (perfil, niveles y estadísticas)</button>
      </div>

      <div id="statsMsg" class="feedback" aria-live="polite" style="display:none"></div>
    </div>
  </section>
  `;

  const showMsg = (text, ok=true)=>{
    const box = $('#statsMsg', root);
    if(!box) return;
    box.className = 'feedback ' + (ok ? 'ok' : 'err');
    box.textContent = text;
    box.style.display = 'block';
  };

  // Reiniciar modo Dec→Bin
  $('#resetDec2Bin', root)?.addEventListener('click', ()=>{
    const st = store.load();
    st.modes = st.modes || {};
    st.modes.dec2bin = defMode();
    store.save(st);
    refreshHeader(st);
    showMsg('Modo Decimal → Binario reiniciado.');
    renderStats(root); // recargar panel
  });

  // Reiniciar modo Bin→Dec
  $('#resetBin2Dec', root)?.addEventListener('click', ()=>{
    const st = store.load();
    st.modes = st.modes || {};
    st.modes.bin2dec = defMode();
    store.save(st);
    refreshHeader(st);
    showMsg('Modo Binario → Decimal reiniciado.');
    renderStats(root);
  });

  // Volver al menú
  $('#goMenu', root)?.addEventListener('click', ()=>{
    location.hash = '#menu';
  });

  // Borrar todo
  $('#resetAll', root)?.addEventListener('click', ()=>{
    const ok = confirm('Esto borrará el perfil, ajustes, niveles y estadísticas. ¿Seguro?');
    if(!ok) return;
    try {
      // si existe store.resetAll lo usamos
      const fresh = defaultState();
      store.save(fresh);
    } catch(e){
      // fallback
      localStorage.removeItem('binTrainer.v2');
    }
    announce('Se ha reiniciado el juego.');
    location.hash = '#menu';
  });
}
