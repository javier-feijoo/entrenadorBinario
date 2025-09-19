// ===============================
// js/game.js — puntuación, niveles y estadísticas por MODO
// ===============================
import { store, LEVELS } from './store.js';
import { clamp, announce, refreshHeader, showCompletionOverlay } from './ui.js';
import { audio } from './audio.js';

// Helper para tomar el slice del modo
function slice(state, mode) {
  // seguridad: si no existe el modo, cae al dec2bin
  return state.modes?.[mode] || state.modes?.dec2bin || state;
}

/**
 * Suma acierto en el MODO indicado
 * @param {object} state - estado global
 * @param {'dec2bin'|'bin2dec'} mode - modo de juego
 * @param {{mult?:number}} opts - multiplicador de puntos (x2 si no hay ayuda)
 */
export function addHit(state, mode = 'dec2bin', { mult = 1 } = {}) {
  const m = slice(state, mode);

  m.stats.attempts++; m.stats.hits++;
  m.streak++; m.bestStreak = Math.max(m.bestStreak || 0, m.streak || 0);

  const base = 10;
  const factor = Math.max(1, Number.isFinite(mult) ? mult : 1);
  m.score = (m.score || 0) + base * factor;

  m.progress = clamp((m.progress || 0) + 1, 0, 10);

  if (m.progress === 10) {
    if (m.levelIdx < LEVELS.length - 1) {
      m.levelIdx++; m.progress = 0;
      audio.play('level');
      announce(`¡Subes a ${LEVELS[m.levelIdx].name} (${mode})!`);
    } else {
      // Último nivel del modo
      audio.play('success');
      showCompletionOverlay(state, mode);
    }
  } else {
    audio.play('success');
  }

  store.save(state);
  refreshHeader(state); // HUD con el modo actual
}

/**
 * Suma fallo en el MODO indicado
 */
export function addMiss(state, mode = 'dec2bin') {
  const m = slice(state, mode);
  m.stats.attempts++; m.stats.miss++;
  m.streak = 0;
  m.score = Math.max(0, (m.score || 0) - 5);
  m.progress = clamp((m.progress || 0) - 1, 0, 10);

  audio.play('error');
  store.save(state);
  refreshHeader(state);
}

// Utilidades numéricas
export const rand255  = () => Math.floor(Math.random() * 256);
export const toBinary8 = (n) => n.toString(2).padStart(8, '0');
export const binToDec  = (bin) => parseInt(bin, 2);