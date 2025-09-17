// js/views/settings.js (final)
// Panel de ajustes: mute, volumen y prueba de sonidos.
// Mantiene compatibilidad con estados antiguos (sin propiedades mute/volume).

import { store, defaultState } from '../store.js';
import { $, announce } from '../ui.js';
import { audio } from '../audio.js';

function applyAudioSettings({ mute=false, volume=1 }){
  const els = audio.els || {};
  Object.values(els).forEach(el => {
    if(!el) return;
    el.muted = !!mute;
    el.volume = typeof volume === 'number' ? Math.max(0, Math.min(1, volume)) : 1;
  });
}

function getSoundState(state){
  // valores por defecto sin romper estados previos
  const def = defaultState().sounds;
  const s = state.sounds || def;
  return {
    click:  s.click  || def.click,
    success:s.success|| def.success,
    error:  s.error  || def.error,
    level:  s.level  || def.level,
    mute:   typeof s.mute === 'boolean' ? s.mute : false,
    volume: typeof s.volume === 'number' ? s.volume : 1
  };
}

export async function renderSettings(root){
  const state = store.load();
  const snd = getSoundState(state);

  root.innerHTML = `
    <section class="view-card">
      <div class="card pad">
        <h2 class="section-title">Ajustes</h2>
        <p class="muted">Los sonidos por defecto están en <code>assets/sounds/</code>. Puedes sustituir los ficheros en cualquier momento.</p>

        <div class="grid cols-2">
          <div>
            <div class="form-row" style="margin:.25rem 0 .5rem">
              <label for="muteToggle">Silencio total</label>
              <input type="checkbox" id="muteToggle" ${snd.mute ? 'checked' : ''} aria-label="Silenciar todos los sonidos"/>
            </div>

            <div class="form-row" style="margin:.25rem 0 .8rem">
              <label for="volRange">Volumen</label>
              <input type="range" id="volRange" min="0" max="100" value="${Math.round(snd.volume*100)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(snd.volume*100)}" aria-label="Volumen (0 a 100)">
              <span id="volLabel" class="pill">${Math.round(snd.volume*100)}%</span>
            </div>

            <div class="form-row wrap" style="margin:.25rem 0 .25rem">
              <button class="btn" id="testClick">Probar “click”</button>
              <button class="btn good" id="testSuccess">Probar “acierto”</button>
              <button class="btn bad" id="testError">Probar “fallo”</button>
              <button class="btn" id="testLevel">Probar “subir nivel”</button>
            </div>
          </div>

          <aside>
            <div class="card soft"><div class="pad">
              <p class="muted">Rutas actuales:</p>
              <ul>
                <li>Click → <code>${snd.click}</code></li>
                <li>Acierto → <code>${snd.success}</code></li>
                <li>Fallo → <code>${snd.error}</code></li>
                <li>Subir nivel → <code>${snd.level}</code></li>
              </ul>
              <div class="form-row" style="margin-top:.5rem">
                <button class="btn ghost" id="restoreDefaults">Restaurar sonidos por defecto</button>
              </div>
            </div></div>
          </aside>
        </div>
      </div>
    </section>
  `;

  // Aplicar configuración actual a elementos de audio
  applyAudioSettings({ mute: snd.mute, volume: snd.volume });

  // --- Listeners
  $('#muteToggle', root)?.addEventListener('change', (e)=>{
    const muted = e.target.checked;
    state.sounds = { ...getSoundState(state), mute: muted };
    store.save(state);
    applyAudioSettings({ mute: muted, volume: state.sounds.volume });
    announce(muted ? 'Sonido silenciado' : 'Sonido activado');
  });

  $('#volRange', root)?.addEventListener('input', (e)=>{
    const v = Math.max(0, Math.min(100, Number(e.target.value)));
    $('#volLabel', root).textContent = `${v}%`;
    const vol = v/100;
    state.sounds = { ...getSoundState(state), volume: vol };
    store.save(state);
    applyAudioSettings({ mute: state.sounds.mute, volume: vol });
  });

  // Botones de prueba
  $('#testClick', root)?.addEventListener('click', ()=> audio.play('click'));
  $('#testSuccess', root)?.addEventListener('click', ()=> audio.play('success'));
  $('#testError', root)?.addEventListener('click', ()=> audio.play('error'));
  $('#testLevel', root)?.addEventListener('click', ()=> audio.play('level'));

  // Restaurar defaults
  $('#restoreDefaults', root)?.addEventListener('click', ()=>{
    const ok = confirm('¿Restaurar las rutas de sonido por defecto?');
    if(!ok) return;
    const def = defaultState();
    state.sounds = { ...def.sounds, mute: false, volume: 1 };
    store.save(state);
    applyAudioSettings({ mute:false, volume:1 });
    announce('Sonidos restaurados');
    // actualizar listado mostrado
    renderSettings(root);
  });

  announce('Ajustes abiertos');
}