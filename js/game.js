// ===============================
// js/game.js (helpers de juego: puntuación, niveles, estadísticas)
// ===============================
import { store, LEVELS } from './store.js';
import { clamp, announce } from './ui.js';
import { audio } from './audio.js';


export function addHit(state){
state.stats.attempts++; state.stats.hits++;
state.streak++; state.bestStreak = Math.max(state.bestStreak, state.streak);
state.score += 10; // +10 por acierto
state.progress = clamp((state.progress||0) + 1, 0, 10);
if(state.progress === 10){
if(state.levelIdx < LEVELS.length - 1){
state.levelIdx++; state.progress = 0; audio.play('level'); announce(`¡Subes a ${LEVELS[state.levelIdx].name}!`);
} else {
audio.play('success'); announce('¡Nivel máximo alcanzado!');
}
} else {
audio.play('success');
}
store.save(state);
}


export function addMiss(state){
state.stats.attempts++; state.stats.miss++;
state.streak = 0;
state.score = Math.max(0, (state.score||0) - 5);
state.progress = clamp((state.progress||0) - 1, 0, 10);
audio.play('error');
store.save(state);
}


// Utilidades numéricas
export const rand255 = ()=> Math.floor(Math.random()*256);
export const toBinary8 = (n)=> n.toString(2).padStart(8,'0');
export const binToDec = (bin)=> parseInt(bin, 2);

