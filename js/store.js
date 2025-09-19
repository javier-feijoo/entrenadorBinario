// ===============================
// js/store.js
// ===============================
export const LEVELS = [
  { key: 'bronce', name: 'Bronce', color: '#b45309', img: 'assets/img/bronce.png' },
  { key: 'plata', name: 'Plata', color: '#94a3b8', img: 'assets/img/plata.png' },
  { key: 'oro', name: 'Oro', color: '#f59e0b', img: 'assets/img/oro.png' },
  { key: 'platino', name: 'Platino', color: '#60a5fa', img: 'assets/img/platino.png' },
  { key: 'diamante', name: 'Diamante', color: '#18d1ff', img: 'assets/img/diamante.png' },
];

const KEY = 'binTrainer.v2';

export const defaultState = () => ({
  profile: { name: '' },
  modes: {
    dec2bin: {
      levelIdx: 0, progress: 0, score: 0, streak: 0, bestStreak: 0,
      stats: { attempts: 0, hits: 0, miss: 0 }
    },
    bin2dec: {
      levelIdx: 0, progress: 0, score: 0, streak: 0, bestStreak: 0,
      stats: { attempts: 0, hits: 0, miss: 0 }
    },
  },
  // ajustes comunes
  sounds: {
    click: 'assets/sounds/click.mp3', success: 'assets/sounds/acierto.mp3',
    error: 'assets/sounds/fallo.mp3', level: 'assets/sounds/nivel.mp3',
    mute: false, volume: 1
  },
  settings: { showWeightsByDefault: true, doubleScoreWithoutHelp: true }
});

// Fusiona el estado cargado con defaults (por compatibilidad)
// compatibilidad con estados antiguos (globales)
function hydrate(raw) {
  const def = defaultState();
  if (!raw) return def;
  const out = { ...def, ...raw };
  // si no existe modes, créalo desde los campos globales antiguos
  if (!raw.modes) {
    const legacy = {
      levelIdx: raw.levelIdx || 0, progress: raw.progress || 0, score: raw.score || 0,
      streak: raw.streak || 0, bestStreak: raw.bestStreak || 0,
      stats: { attempts: raw.stats?.attempts || 0, hits: raw.stats?.hits || 0, miss: raw.stats?.miss || 0 }
    };
    out.modes = { dec2bin: { ...legacy }, bin2dec: { ...legacy } };
    // opcional: eliminar campos legacy si quieres
  } else {
    out.modes = {
      dec2bin: { ...def.modes.dec2bin, ...(raw.modes.dec2bin || {}) },
      bin2dec: { ...def.modes.bin2dec, ...(raw.modes.bin2dec || {}) },
    };
  }
  out.sounds = { ...def.sounds, ...(raw.sounds || {}) };
  out.settings = { ...def.settings, ...(raw.settings || {}) };
  out.profile = { ...def.profile, ...(raw.profile || {}) };
  return out;
}

export const store = {
  load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      return hydrate(raw || defaultState());
    } catch (e) {
      return defaultState();
    }
  },
  save(state) { localStorage.setItem(KEY, JSON.stringify(state)); },
  resetAll() { const s = defaultState(); this.save(s); return s; }
};

export function hasUser(state) { return !!state?.profile?.name?.trim(); }
export function setUser(state, name) { state.profile.name = (name || '').trim(); store.save(state); return state; }
export function resetUser(state) {
  state.profile = { name: '' };
  state.levelIdx = 0; state.progress = 0; state.score = 0; state.streak = 0;
  store.save(state); return state;
}
