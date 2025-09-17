// ===============================
// js/views/bin2dec.js (Binario → Decimal)
// ===============================
import { store } from '../store.js';
import { $, announce, renderLevelHud, setWelcome } from '../ui.js';
import { createBits } from '../components/bits.js';
import { addHit, addMiss, rand255, toBinary8, binToDec } from '../game.js';


let bitsReadonly; let roundB = { targetBin: null, tries: 3 };


function newRound(root){
roundB.targetBin = toBinary8(rand255());
roundB.tries = 3;
$('#shownBinary', root).textContent = roundB.targetBin;
bitsReadonly.setFromString(roundB.targetBin);
$('#triesB2D', root).textContent = roundB.tries;
$('#answerB2D', root).value = '';
$('#fbB2D', root).textContent = '';
}


function check(root){
const state = store.load();
const ans = parseInt($('#answerB2D', root).value, 10);
if(Number.isNaN(ans) || ans<0 || ans>255){ $('#fbB2D', root).textContent = 'Introduce un número entre 0 y 255.'; return; }
const target = binToDec(roundB.targetBin);
if(ans === target){
$('#fbB2D', root).textContent = '¡Correcto!';
addHit(state); renderLevelHud(state); setWelcome(state);
newRound(root);
} else {
roundB.tries--; $('#triesB2D', root).textContent = roundB.tries;
$('#fbB2D', root).textContent = `No es ${ans}. Intenta de nuevo.`;
addMiss(state); renderLevelHud(state); setWelcome(state);
if(roundB.tries===0){ newRound(root); }
}
}


export async function renderBin2Dec(root){
const state = store.load();
root.innerHTML = `
<section class="view-card">
<div class="card pad">
<div class="view-head">
<h2 class="section-title">Modo: Binario → Decimal</h2>
<div class="actions">
<button class="btn" id="btnNewB2D">Nuevo número</button>
<button class="btn good" id="btnCheckB2D">Comprobar</button>
</div>
</div>
<p class="muted">Calcula el valor decimal del número binario mostrado. Intentos: <span class="badge" id="triesB2D">3</span></p>
<div class="target"><span class="muted">Número binario:</span> <strong id="shownBinary">—</strong></div>
<div class="bits readonly" id="bitsB2D" role="group" aria-label="Bits mostrados (solo lectura)"></div>
<div class="form-row center" style="margin-top:.4rem">
<label for="answerB2D" class="sr-only">Respuesta decimal</label>
<input id="answerB2D" type="number" min="0" max="255" placeholder="Tu respuesta (0-255)" />
</div>
<div class="feedback" id="fbB2D" aria-live="polite"></div>
</div>
</section>
`;


setWelcome(state); renderLevelHud(state);


bitsReadonly = createBits($('#bitsB2D', root), { readonly:true });
$('#btnNewB2D', root).addEventListener('click', ()=> newRound(root));
$('#btnCheckB2D', root).addEventListener('click', ()=> check(root));


newRound(root);
announce('Vista Binario a Decimal');
}