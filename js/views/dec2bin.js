

// ===============================
// js/views/dec2bin.js (Decimal → Binario)
// ===============================
import { store } from '../store.js';
import { $, announce, renderLevelHud, setWelcome } from '../ui.js';
import { createBits } from '../components/bits.js';
import { addHit, addMiss, rand255, binToDec } from '../game.js';


let bitsApi; // persistimos para eventos
let round = { target: null, tries: 3 };


function renderWeights(container){
const el = (typeof container==='string')? document.querySelector(container): container;
el.innerHTML = '';
;[128,64,32,16,8,4,2,1].forEach(w=>{
const d = document.createElement('div'); d.className='w'; d.textContent = w; el.appendChild(d);
});
}


function newRound(root){
round.target = rand255();
round.tries = 3;
$('#targetD2B', root).textContent = round.target;
$('#triesD2B', root).textContent = round.tries;
bitsApi.clear();
$('#fbD2B', root).textContent = '';
}


function check(root){
const state = store.load();
const val = binToDec(bitsApi.toString());
if(val === round.target){
$('#fbD2B', root).textContent = '¡Correcto!';
addHit(state);
renderLevelHud(state); setWelcome(state);
newRound(root);
} else {
round.tries--; $('#triesD2B', root).textContent = round.tries;
$('#fbD2B', root).textContent = `No es ${val}. Inténtalo de nuevo.`;
addMiss(state);
renderLevelHud(state); setWelcome(state);
if(round.tries===0){ newRound(root); }
}
}


export async function renderDec2Bin(root){
const state = store.load();
root.innerHTML = `
<section class="view-card">
<div class="card pad">
<div class="view-head">
<h2 class="section-title">Modo: Decimal → Binario</h2>
<div class="actions">
<button class="btn" id="btnNewD2B">Nuevo número</button>
<button class="btn good" id="btnCheckD2B">Comprobar</button>
</div>
</div>
<p class="muted">Representa el número en binario pulsando los bits. Intentos: <span class="badge" id="triesD2B">3</span></p>
<div class="target" id="targetD2B" aria-live="polite">—</div>
<div class="weights" id="weightsD2B" aria-hidden="true"></div>
<div class="bits" id="bitsD2B" role="group" aria-label="Interruptores de bits (MSB a LSB)"></div>
<div class="feedback" id="fbD2B" aria-live="polite"></div>
</div>
</section>
`;


// Render HUD de nivel (si hay panel en home)
setWelcome(state); renderLevelHud(state);


// bits y pesos
bitsApi = createBits($('#bitsD2B', root), { onToggle: ()=>{} });
renderWeights($('#weightsD2B', root));


// eventos
$('#btnNewD2B', root).addEventListener('click', ()=> newRound(root));
$('#btnCheckD2B', root).addEventListener('click', ()=> check(root));


newRound(root);
announce('Vista Decimal a Binario');
}