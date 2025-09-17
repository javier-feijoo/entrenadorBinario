// ===============================
// js/ui.js (HUD compacto + nav deshabilitado)
// ===============================
import { LEVELS, hasUser } from './store.js';


// Helpers DOM
export const $ = (s, root=document) => root.querySelector(s);
export const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
export const clamp = (v,min,max)=> Math.max(min, Math.min(max, v));


// Región aria-live global
const live = document.getElementById('live');
export function announce(msg){ if(live){ live.textContent = msg; } }


// Saludo cabecera
export function setWelcome(state){
const el = document.getElementById('userWelcome');
const name = state?.profile?.name?.trim();
if(el) el.textContent = name ? `Hola, ${name}` : 'Bienvenido';
}


// ===== HUD antiguo (compatibilidad con pantallas legacy)
export function renderLevelHud(state){
const L = LEVELS[state.levelIdx] || LEVELS[0];
const img = document.getElementById('levelImg');
const name = document.getElementById('levelName');
const score = document.getElementById('scoreVal');
const progNum = document.getElementById('levelProg');
const progBar = document.getElementById('levelProgress');
if(img) img.src = L.img;
if(name) name.textContent = L.name;
if(score) score.textContent = state.score ?? 0;
if(progNum) progNum.textContent = `${state.progress ?? 0}/10`;
if(progBar) progBar.style.width = `${((state.progress ?? 0)/10)*100}%`;
}


// ===== HUD compacto en barra fija (ids: hudLevelImg, hudLevelName, hudUserName, hudScore, hudStreak, hudProgBar, hudProgText)
export function renderHudBar(state){
const L = LEVELS[state.levelIdx] || LEVELS[0];
$('#hudLevelImg')?.setAttribute('src', L.img);
const uname = state?.profile?.name?.trim() || 'Invitado';
const p = clamp(state?.progress ?? 0, 0, 10);
const score = state?.score ?? 0;
const streak = state?.streak ?? 0;
const bar = $('#hudProgBar');
const pb = document.querySelector('.hud-progress');


const setText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = String(val); };
setText('hudLevelName', L.name);
setText('hudUserName', uname);
setText('hudScore', score);
setText('hudStreak', streak);
setText('hudProgText', `${p}/10`);
if(bar) bar.style.width = `${(p/10)*100}%`;
if(pb) pb.setAttribute('aria-valuenow', String(p));
}


// ===== Navegación: habilitar/deshabilitar rutas según si hay usuario
export function enableHeaderNav(state){
const has = hasUser(state);
// Habilitar todo de base
$$('.main-nav .nav').forEach(b=>{ b.removeAttribute('disabled'); b.classList.remove('is-disabled'); });
if(!has){
// Bloquear rutas de juego si no hay usuario
const sel = '.main-nav [data-to="#dec2bin"], .main-nav [data-to="#bin2dec"], .main-nav [data-to="#stats"], .main-nav [data-to="#settings"]';
$$(sel).forEach(b=>{ b.setAttribute('disabled','disabled'); b.classList.add('is-disabled'); });
}
}


// Focus util
export function focusMain(){ const root = document.getElementById('app-root'); if(root) root.focus(); }


// ===== Refresco rápido del header/HUD (convenience)
export function refreshHeader(state){
setWelcome(state);
renderHudBar(state);
enableHeaderNav(state);
}