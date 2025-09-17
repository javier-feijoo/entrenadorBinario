// ===============================
// js/ui.js
// ===============================
import { LEVELS, hasUser } from './store.js';


export const $ = (s, root=document) => root.querySelector(s);
export const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
export const clamp = (v,min,max)=> Math.max(min, Math.min(max, v));


const live = document.getElementById('live');
export function announce(msg){ if(live){ live.textContent = msg; } }


export function setWelcome(state){
const el = document.getElementById('userWelcome');
const name = state?.profile?.name?.trim();
el && (el.textContent = name ? `Hola, ${name}` : 'Bienvenido');
}


export function renderLevelHud(state){
const L = LEVELS[state.levelIdx] || LEVELS[0];
const img = document.getElementById('levelImg');
const name = document.getElementById('levelName');
const score = document.getElementById('scoreVal');
const progNum = document.getElementById('levelProg');
const progBar = document.getElementById('levelProgress');
if(img) img.src = L.img;
if(name) name.textContent = L.name;
if(score) score.textContent = state.score;
if(progNum) progNum.textContent = `${state.progress}/10`;
if(progBar) progBar.style.width = `${(state.progress/10)*100}%`;
}


export function enableHeaderNav(state){
const has = hasUser(state);
$$('.main-nav .nav').forEach(btn=> btn.removeAttribute('disabled'));
if(!has){
// si no hay usuario, bloquea rutas de juego y dirige a menú
$$('.main-nav [data-to="#dec2bin"], .main-nav [data-to="#bin2dec"], .main-nav [data-to="#stats"], .main-nav [data-to="#settings"]').forEach(b=> b.setAttribute('disabled','disabled'));
}
}


export function focusMain(){ const root = document.getElementById('app-root'); if(root){ root.focus(); } }

