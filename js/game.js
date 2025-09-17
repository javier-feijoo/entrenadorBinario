// ===============================
// js/game.js (puntuación, niveles, estadísticas)
// ===============================
import { store, LEVELS } from './store.js';
import { clamp, announce, refreshHeader } from './ui.js';
import { audio } from './audio.js';

// ✅ NUEVO: permite multiplicador (p.ej. x2 si la ayuda está oculta)
export function addHit(state, { mult = 1 } = {}){
  state.stats.attempts++; state.stats.hits++;
  state.streak++; state.bestStreak = Math.max(state.bestStreak, state.streak);

  const base = 10;
  const m = Math.max(1, Number.isFinite(mult) ? mult : 1);
  state.score += base * m;

  state.progress = clamp((state.progress||0) + 1, 0, 10);

  if(state.progress === 10){
    if(state.levelIdx < LEVELS.length - 1){
      state.levelIdx++; state.progress = 0;
      audio.play('level'); announce(`¡Subes a ${LEVELS[state.levelIdx].name}!`);
    } else {
      audio.play('success'); announce('¡Nivel máximo alcanzado!');
    }
  } else {
    audio.play('success');
  }
  store.save(state);
  refreshHeader(state);
}

export function addMiss(state){
  state.stats.attempts++; state.stats.miss++;
  state.streak = 0;
  state.score = Math.max(0, (state.score||0) - 5);
  state.progress = clamp((state.progress||0) - 1, 0, 10);
  audio.play('error');
  store.save(state);
  refreshHeader(state);
}

// Utilidades numéricas
export const rand255 = ()=> Math.floor(Math.random()*256);
export const toBinary8 = (n)=> n.toString(2).padStart(8,'0');
export const binToDec = (bin)=> parseInt(bin, 2);
