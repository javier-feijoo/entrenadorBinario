// ===============================
// js/views/bin2dec.js — Modo Binario → Decimal (ayuda oculta + x2)
// ===============================

import { store } from '../store.js';
import { $, announce, refreshHeader } from '../ui.js';
import { createBits } from '../components/bits.js';
import { addHit, addMiss, rand255, toBinary8, binToDec } from '../game.js';

let bitsReadonly;                          // bits mostrados (solo lectura)
let round = { targetBin: '00000000', tries: 3 };
let helpVisible = false;                   // ayuda oculta por defecto

function renderWeights(container){
  const el = (typeof container==='string')? document.querySelector(container): container;
  if(!el) return;
  el.innerHTML = '';
  [128,64,32,16,8,4,2,1].forEach(w=>{
    const d = document.createElement('div');
    d.className='w'; d.textContent = w; el.appendChild(d);
  });
}

function newRound(root){
  round.targetBin = toBinary8(rand255());
  round.tries = 3;
  $('#shownBinary', root).textContent = round.targetBin;
  bitsReadonly?.setFromString(round.targetBin);
  $('#triesB2D', root).textContent = String(round.tries);
  $('#answerB2D', root).value = '';
  $('#fbB2D', root).textContent = '';
}

function updateHelpUI(root){
  $('#weightsB2D', root).hidden = !helpVisible;
  const dbl = !!(store.load().settings?.doubleScoreWithoutHelp);
  $('#scoreHintB2D', root).textContent = (!helpVisible && dbl) ? 'Aciertos: x2' : 'Aciertos: x1';
}

function checkAnswer(root){
  const state = store.load();
  const ans = parseInt($('#answerB2D', root).value, 10);
  if(Number.isNaN(ans) || ans < 0 || ans > 255){
    $('#fbB2D', root).textContent = 'Introduce un número entre 0 y 255.';
    return;
  }
  const target = binToDec(round.targetBin);
  if(ans === target){
    const dbl = !!state.settings?.doubleScoreWithoutHelp;
    const mult = (!helpVisible && dbl) ? 2 : 1;
    $('#fbB2D', root).textContent = '¡Correcto!';
    addHit(state, { mult });              // ⬅️ aplica multiplicador
    refreshHeader(state);
    newRound(root);
    return;
  }

  round.tries -= 1;
  $('#triesB2D', root).textContent = String(round.tries);
  $('#fbB2D', root).textContent = `No es ${ans}. Intenta de nuevo.`;
  addMiss(state);
  refreshHeader(state);
  if(round.tries === 0){ newRound(root); }
}

export async function renderBin2Dec(root){
  // ayuda por defecto: si hay preferencia guardada, úsala; si no, oculto
  const st = store.load();
  helpVisible = (st.settings?.showWeightsByDefault ?? false);

  root.innerHTML = `
    <section class="view-card">
      <div class="card pad">
        <h2 class="section-title">Modo: Binario → Decimal</h2>

        <div class="game-wrap">
          <div class="target-row" style="display:grid; justify-items:center; gap:.35rem;">
            <div class="muted">Número binario:</div>
            <div class="target-big" id="shownBinary" aria-live="polite">—</div>
          </div>

        <div class="form-row" style="justify-content:center; gap:.6rem">
          <label class="pill big" style="background:#0a1433">
            <input type="checkbox" id="toggleHelpB2D"> Mostrar ayuda (128…1)
          </label>
          <span class="pill big" id="scoreHintB2D">Aciertos: x1</span>
        </div>

          <div class="weights-row grid-8" id="weightsB2D" aria-hidden="true"></div>
          <div class="bits-grid grid-8 readonly" id="bitsB2D"
               role="group" aria-label="Bits mostrados (solo lectura)"></div>

          <div class="actions-row">
            <span class="pill big" aria-live="polite" aria-label="Intentos restantes">
              Intentos: <strong id="triesB2D">3</strong>
            </span>
            <button class="btn good btn-xl" id="btnCheckB2D">Comprobar</button>
          </div>

          <div class="form-row center" style="margin-top:.4rem">
            <label for="answerB2D" class="sr-only">Respuesta decimal</label>
            <input id="answerB2D" class="input-lg wide" type="number" min="0" max="255" placeholder="Tu respuesta (0-255)" />
          </div>

          <div class="feedback" id="fbB2D" aria-live="polite"></div>
        </div>
      </div>
    </section>
  `;

  // Inicializar bits (solo lectura) y pesos
  bitsReadonly = createBits($('#bitsB2D', root), { readonly: true });
  renderWeights($('#weightsB2D', root));

  // Ajústate a la preferencia y al estado inicial (oculto por defecto)
  $('#toggleHelpB2D', root).checked = helpVisible;
  updateHelpUI(root);

  // Eventos
  $('#toggleHelpB2D', root).addEventListener('change', (e)=>{
    helpVisible = !!e.target.checked;
    updateHelpUI(root);
  });
  $('#btnCheckB2D', root).addEventListener('click', ()=> checkAnswer(root));

  // Primera ronda
  newRound(root);
  announce('Vista Binario a Decimal');
}
