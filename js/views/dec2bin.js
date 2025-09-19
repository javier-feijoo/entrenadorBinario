// ===============================
// js/views/dec2bin.js — Modo Decimal → Binario (ayuda oculta + x2)
// ===============================

import { store } from '../store.js';
import { $, announce, refreshHeader } from '../ui.js';
import { createBits } from '../components/bits.js';
import { addHit, addMiss, rand255, binToDec } from '../game.js';

let bitsApi;                           // API del componente de bits
let round = { target: 0, tries: 3 };
let helpVisible = false;               // ayuda oculta por defecto

function renderWeights(container){
  const el = (typeof container==='string')? document.querySelector(container): container;
  if(!el) return;
  el.innerHTML = '';
  [128,64,32,16,8,4,2,1].forEach(w=>{
    const d = document.createElement('div');
    d.className='w';
    d.textContent = w;
    el.appendChild(d);
  });
}

function newRound(root){
  round.target = rand255();
  round.tries = 3;
  $('#targetD2B', root).textContent = String(round.target);
  $('#triesD2B', root).textContent = String(round.tries);
  bitsApi?.clear();
  $('#fbD2B', root).textContent = '';
}

function updateHelpUI(root){
  $('#weightsD2B', root).hidden = !helpVisible;
  const dbl = !!(store.load().settings?.doubleScoreWithoutHelp);
  $('#scoreHintD2B', root).textContent = (!helpVisible && dbl) ? 'Aciertos: x2' : 'Aciertos: x1';
}

function checkAnswer(root){
  const state = store.load();
  const binStr = bitsApi.toString();
  const val = binToDec(binStr);

  if(val === round.target){
    const dbl = !!state.settings?.doubleScoreWithoutHelp;
    const mult = (!helpVisible && dbl) ? 2 : 1;
    $('#fbD2B', root).className = 'feedback ok';   
    $('#fbD2B', root).textContent = '¡Correcto!';
    addHit(state, { mult });           // ⬅️ aplica multiplicador
    refreshHeader(state);
    newRound(root);
    return;
  }

  round.tries -= 1;
  $('#triesD2B', root).textContent = String(round.tries);
  $('#fbD2B', root).className = 'feedback err'; 
  $('#fbD2B', root).textContent = `No es ${val}. Inténtalo de nuevo.`;
  addMiss(state);
  refreshHeader(state);
  if(round.tries === 0){ newRound(root); }
}

export async function renderDec2Bin(root){
  // ayuda por defecto: si hay preferencia guardada, úsala; si no, oculto
  const st = store.load();
  helpVisible = (st.settings?.showWeightsByDefault ?? false);

  root.innerHTML = `
  <section class="view-card">
    <div class="card pad">
      <h2 class="section-title">Modo: Decimal → Binario</h2>

      <!-- Barra de controles arriba, a la derecha -->
      <div class="helpbar" role="group" aria-label="Controles de ayuda y puntuación">
        <label class="switch" for="toggleHelpD2B">
          <span>Ayuda</span>
          <input type="checkbox" id="toggleHelpD2B" aria-label="Mostrar ayuda (valores 128 a 1)">
          <span class="track" aria-hidden="true"><span class="knob"></span></span>
          <span class="labels"><span class="no">No</span><span class="yes">Sí</span></span>
        </label>
        <span class="hint" id="scoreHintD2B">Aciertos: x1</span>
      </div>

      <div class="game-wrap">
        <div class="target-big" id="targetD2B" aria-live="polite">—</div>

        <div class="weights-row grid-8" id="weightsD2B" aria-hidden="true"></div>

        <div class="bits-grid grid-8" id="bitsD2B"
             role="group" aria-label="Interruptores de bits (MSB a LSB)"></div>

        <div class="actions-row">
          <span class="pill big" aria-live="polite" aria-label="Intentos restantes">
            Intentos: <strong id="triesD2B">3</strong>
          </span>
          <button class="btn good btn-xl" id="btnCheckD2B">Comprobar</button>
        </div>

        <div class="feedback" id="fbD2B" aria-live="polite"></div>
      </div>
    </div>
  </section>
`;

  // Inicializar componentes
  bitsApi = createBits($('#bitsD2B', root), { onToggle: ()=>{} });
  renderWeights($('#weightsD2B', root));

  // Ajústate a la preferencia y al estado inicial (oculto por defecto)
  $('#toggleHelpD2B', root).checked = helpVisible;
  updateHelpUI(root);

  // Eventos
$('#toggleHelpD2B', root).addEventListener('change', (e)=>{
  helpVisible = !!e.target.checked;
  updateHelpUI(root);
  // ⚠️ Para evitar trampas, empezamos una ronda nueva
  newRound(root);
  announce(helpVisible
    ? 'Ayuda activada. Nuevo número generado.'
    : 'Ayuda desactivada. Nuevo número generado (aciertos x2 si está activo en Ajustes).'
  );
});

  $('#btnCheckD2B', root).addEventListener('click', ()=> checkAnswer(root));

  // Primera ronda
  newRound(root);
  announce('Vista Decimal a Binario');
}
