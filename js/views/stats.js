

// ===============================
// js/views/stats.js
// ===============================
import { store } from '../store.js';
import { $ } from '../ui.js';


export async function renderStats(root){
const s = store.load();
const acc = s.stats.attempts ? Math.round(s.stats.hits / s.stats.attempts * 100) : 0;
root.innerHTML = `
<section class="view-card">
<div class="card pad">
<h2 class="section-title">Estadísticas</h2>
<div class="grid cols-2">
<div>
<ul class="stats-list">
<li>Total intentos: <strong id="stTotal">${s.stats.attempts}</strong></li>
<li>Aciertos: <strong id="stHits">${s.stats.hits}</strong></li>
<li>Fallos: <strong id="stMiss">${s.stats.miss}</strong></li>
<li>Efectividad: <strong id="stAcc">${acc}%</strong></li>
<li>Mejor racha: <strong id="stBest">${s.bestStreak}</strong></li>
</ul>
</div>
<div class="right">
<div class="form-row wrap">
<button class="btn" id="btnResetLevel">Reiniciar progreso nivel</button>
<button class="btn bad" id="btnResetAll">Borrar todo (reiniciar juego)</button>
</div>
</div>
</div>
</div>
</section>
`;


$('#btnResetLevel', root).addEventListener('click', ()=>{
const st = store.load();
st.progress = 0; st.levelIdx = 0; st.score = 0; st.streak = 0; store.save(st);
location.hash = '#menu';
});
$('#btnResetAll', root).addEventListener('click', ()=>{
const ok = confirm('Esto borrará nombre, niveles y estadísticas. ¿Seguro?');
if(!ok) return; localStorage.removeItem('binTrainer.v2'); location.hash = '#menu';
});
}