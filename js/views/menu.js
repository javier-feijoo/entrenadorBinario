// ===============================
import { store, defaultState, hasUser, setUser, resetUser } from '../store.js';
import { navigate } from '../router.js';


export async function renderMenu(root){
const state = store.load();
const userExists = hasUser(state);


root.innerHTML = `
<section class="menu view-card">
<div class="card"><div class="pad">
<div class="hero">
<div>
<div class="big">Aprende Binario Jugando</div>
<p class="lead">Practica conversiones con 8 bits. Elige un modo de juego cuando estés listo.</p>
<div class="actions" style="margin-top:.8rem">
<button class="btn primary" id="btnContinue" ${userExists?'':'disabled'}>Continuar</button>
<button class="btn good" id="btnStart">Empezar partida</button>
<button class="btn" id="btnNewUser">Nuevo usuario</button>
<button class="btn ghost" id="btnAbout">¿Cómo se juega?</button>
</div>
<div class="warning" id="startWarn" hidden>
<strong>Aviso:</strong> “Empezar partida” reiniciará puntuación, progreso y racha.
</div>
</div>
<aside>
<div class="hud card soft"><div class="pad">
<p class="muted">Perfil actual:</p>
<div class="form-row">
<label class="sr-only" for="nameInput">Tu nombre</label>
<input id="nameInput" type="text" placeholder="Tu nombre o nick" value="${state.profile.name||''}">
<button class="btn" id="btnSaveName">Guardar nombre</button>
</div>
</div></div>
</aside>
</div>
</div></div>
</section>
`;


const $ = (s)=> root.querySelector(s);
const startWarn = $('#startWarn');
const btnStart = $('#btnStart');
const btnContinue = $('#btnContinue');


// Guardar nombre
$('#btnSaveName').addEventListener('click', ()=>{
const v = $('#nameInput').value.trim();
setUser(state, v);
announce('Nombre guardado');
btnContinue && btnContinue.removeAttribute('disabled');
});


// Continuar (requiere usuario)
btnContinue?.addEventListener('click', ()=>{
if(!hasUser(state)) return;
navigate('#dec2bin');
});


// Empezar partida (reinicia datos, con confirmación accesible)
btnStart?.addEventListener('click', ()=>{
startWarn.hidden = false;
const ok = confirm('Empezar partida reiniciará puntuación, progreso y racha. ¿Quieres continuar?');
if(!ok) return;
const fresh = defaultState();
fresh.profile.name = state.profile.name; // conservamos nombre
localStorage.setItem('binTrainer.v2', JSON.stringify(fresh));
announce('Partida iniciada desde cero');
navigate('#dec2bin');
});


// Nuevo usuario (limpia perfil y progreso)
$('#btnNewUser').addEventListener('click', ()=>{
const ok = confirm('Crear un nuevo usuario borrará el perfil actual y su progreso. ¿Continuar?');
if(!ok) return; resetUser(state); announce('Usuario restablecido');
const nameEl = $('#nameInput'); nameEl.focus();
});


// Ayuda básica
$('#btnAbout').addEventListener('click', ()=>{
alert('Instrucciones rápidas:\n\n• Usa Tab y Espacio/Enter para alternar bits.\n• Tienes 3 intentos por número.\n• Completa 10 aciertos para subir de nivel.');
});
}