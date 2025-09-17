// ===============================
// js/store.js
// ===============================
export const LEVELS = [
{ key:'bronce', name:'Bronce', color:'#b45309', img:'assets/img/bronce.png' },
{ key:'plata', name:'Plata', color:'#94a3b8', img:'assets/img/plata.png' },
{ key:'oro', name:'Oro', color:'#f59e0b', img:'assets/img/oro.png' },
{ key:'platino', name:'Platino', color:'#60a5fa', img:'assets/img/platino.png' },
{ key:'diamante',name:'Diamante',color:'#18d1ff', img:'assets/img/diamante.png' },
];


const KEY = 'binTrainer.v2';


export const defaultState = () => ({
profile: { name: '' },
levelIdx: 0, // 0..4
progress: 0, // 0..10 (aciertos para subir de nivel)
score: 0,
streak: 0,
bestStreak: 0,
stats: { attempts: 0, hits: 0, miss: 0 },
sounds: {
click: 'assets/sounds/click.mp3',
success:'assets/sounds/acierto.mp3',
error: 'assets/sounds/fallo.mp3',
level: 'assets/sounds/nivel.mp3'
}
});


export const store = {
load(){
try { return JSON.parse(localStorage.getItem(KEY)) || defaultState(); }
catch(e){ return defaultState(); }
},
save(state){ localStorage.setItem(KEY, JSON.stringify(state)); },
resetAll(){ const s = defaultState(); this.save(s); return s; }
};


export function hasUser(state){ return !!state?.profile?.name?.trim(); }
export function setUser(state, name){ state.profile.name = (name||'').trim(); store.save(state); return state; }
export function resetUser(state){ state.profile = {name:''}; state.levelIdx=0; state.progress=0; state.score=0; state.streak=0; store.save(state); return state; }

