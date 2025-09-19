// ===============================
// js/ui.js — HUD por modo + modal elegante + nav deshabilitado
// ===============================
import { LEVELS, hasUser } from './store.js';

// ---------- Helpers DOM ----------
export const $  = (s, root=document) => root.querySelector(s);
export const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
export const clamp = (v,min,max)=> Math.max(min, Math.min(max, v));

// ---------- Aria-live global ----------
let live = document.getElementById('live');
export function announce(msg){
  // si el nodo aún no existe (por orden de carga), reintenta
  if(!live) live = document.getElementById('live');
  if(live) live.textContent = msg;
}

// ---------- Saludo cabecera ----------
export function setWelcome(state){
  const el = document.getElementById('userWelcome');
  const name = state?.profile?.name?.trim();
  if(el) el.textContent = name ? `Hola, ${name}` : 'Bienvenido';
}

// ---------- Detección del modo por la ruta ----------
export function currentModeFromHash(){
  return location.hash?.startsWith('#bin2dec') ? 'bin2dec' : 'dec2bin';
}

// ---------- HUD compacto por modo ----------
export function renderHudBar(state, mode = currentModeFromHash()){
  // estado del modo actual
  const m = state?.modes?.[mode] || state?.modes?.dec2bin || {
    levelIdx:0, progress:0, score:0, streak:0,
  };
  const L = LEVELS[m.levelIdx] || LEVELS[0];

  $('#hudLevelImg')?.setAttribute('src', L.img);
  const setText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = String(val); };

  setText('hudLevelName', `${L.name} · ${mode}`);
  setText('hudUserName', state?.profile?.name?.trim() || 'Invitado');
  setText('hudScore',    m.score  ?? 0);
  setText('hudStreak',   m.streak ?? 0);

  const p = clamp(m.progress ?? 0, 0, 10);
  setText('hudProgText', `${p}/10`);

  const bar = $('#hudProgBar');
  if(bar) bar.style.width = `${(p/10)*100}%`;
  const pb = document.querySelector('.hud-progress');
  if(pb) pb.setAttribute('aria-valuenow', String(p));
}

// ---------- Navegación: bloquear si no hay usuario ----------
export function enableHeaderNav(state){
  const has = hasUser(state);
  $$('.main-nav .nav').forEach(b=>{ b.removeAttribute('disabled'); b.classList.remove('is-disabled'); });
  if(!has){
    const sel = '.main-nav [data-to="#dec2bin"], .main-nav [data-to="#bin2dec"], .main-nav [data-to="#stats"], .main-nav [data-to="#settings"]';
    $$(sel).forEach(b=>{ b.setAttribute('disabled','disabled'); b.classList.add('is-disabled'); });
  }
}

// ---------- Focus útil ----------
export function focusMain(){
  const root = document.getElementById('app-root');
  if(root) root.focus();
}

// ---------- Refresco centralizado ----------
export function refreshHeader(state){
  setWelcome(state);
  renderHudBar(state, currentModeFromHash());
  enableHeaderNav(state);
}

// ===============================
// Modal genérico
// ===============================
export function showModal({ title='Mensaje', html='', onClose=null, actions=[] }){
  const $b = document.createElement('div');
  $b.className = 'modal-backdrop';
  $b.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="head">
        <div class="modal-title">${title}</div>
        <button class="btn ghost" id="modalClose" aria-label="Cerrar">Cerrar</button>
      </div>
      <div class="body">${html}</div>
      <div class="actions" id="modalActions"></div>
    </div>`;
  document.body.appendChild($b);

  const close = ()=>{ $b.remove(); onClose && onClose(); };
  $b.querySelector('#modalClose').addEventListener('click', close);

  const onEsc = (e)=>{ if(e.key==='Escape'){ e.preventDefault(); close(); } };
  document.addEventListener('keydown', onEsc, { once:true });

  const actionsBox = $b.querySelector('#modalActions');
  (actions.length ? actions : [{ text:'Aceptar', class:'btn good', click:close }])
    .forEach(a=>{
      const btn = document.createElement('button');
      btn.className = a.class || 'btn';
      btn.textContent = a.text || 'Aceptar';
      btn.addEventListener('click', ()=>{ (a.click||close)(); close(); });
      actionsBox.appendChild(btn);
    });
}

// ===============================
// Modal de “juego completado” por modo
// ===============================
export function showCompletionOverlay(state, mode){
  const m = state?.modes?.[mode] || state?.modes?.dec2bin || { levelIdx:0 };
  const L = LEVELS[m.levelIdx] || LEVELS.at(-1) || LEVELS[0];

  const html = `
    <div class="modal-badge">
      <img src="${L.img}" alt="Insignia ${L.name}">
      <div>
        <div><strong>${L.name}</strong> completado en <strong>${mode}</strong></div>
        <div class="muted">¡Has alcanzado el nivel máximo de este modo!</div>
      </div>
    </div>
    <p>🎉 <strong>¡Enhorabuena!</strong> Puedes seguir practicando para batir tu puntuación o cambiar de modo.</p>
  `;

  showModal({
    title: '🏆 Juego completado',
    html,
    actions: [
      { text:'Cambiar de modo', class:'btn',      click:()=> location.hash = (mode==='dec2bin' ? '#bin2dec' : '#dec2bin') },
      { text:'Seguir practicando', class:'btn good' },
      { text:'Menú', class:'btn ghost',          click:()=> location.hash = '#menu' }
    ]
  });
}
