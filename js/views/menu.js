// js/views/menu.js (final corregido)
// Exporta correctamente "renderMenu" como export nombrado.
// UI simplificada y accesible: Continuar, Empezar de cero, Borrar perfil + nombre.

import { store, defaultState, hasUser, setUser, resetUser } from '../store.js';
import { $, announce,refreshHeader } from '../ui.js';
import { navigate } from '../router.js';

function showConfirm(root, { title='¿Seguro?', text='', onConfirm, onCancel }){
  const slot = root.querySelector('.confirm-slot');
  if(!slot) return;
  const panel = document.createElement('div');
  panel.className = 'confirm-panel card';
  panel.innerHTML = `
    <div class="pad">
      <h3 class="confirm-title">${title}</h3>
      <p class="muted">${text}</p>
      <div class="form-row wrap">
        <button class="btn bad btn-xl" id="cpConfirm">Sí, continuar</button>
        <button class="btn ghost btn-xl" id="cpCancel">Cancelar</button>
      </div>
    </div>
  `;
  slot.replaceChildren(panel);
  $('#cpConfirm', panel).focus();
  $('#cpConfirm', panel).addEventListener('click', ()=>{ panel.remove(); onConfirm && onConfirm(); });
  $('#cpCancel', panel).addEventListener('click', ()=>{ panel.remove(); onCancel && onCancel(); });
}

export async function renderMenu(root){
  const state = store.load();
  const userExists = hasUser(state);

  root.innerHTML = `
    <section class="menu view-card">
      <div class="card"><div class="pad">
        <div class="menu-grid">
          <div class="menu-left">
            <h2 class="big">Aprende Binario Jugando</h2>
            <p class="lead">Conversión decimal ⇄ binario con 8 bits. Guarda tu progreso por usuario.</p>

            <div class="tile-actions">
              <button class="btn primary btn-xl block" id="btnContinue" ${userExists? '' : 'disabled'}>
                Continuar
                <span class="sub">Seguir donde lo dejaste</span>
              </button>
              <button class="btn good btn-xl block" id="btnStart">
                Empezar de cero
                <span class="sub">Reinicia puntuación y progreso</span>
              </button>
            </div>

            <div class="confirm-slot" aria-live="polite"></div>
          </div>

          <aside class="menu-right">
            <div class="card soft"><div class="pad">
              <h3 class="section-title">Usuario</h3>
              <p class="muted">Introduce un nombre corto o apodo. Se usa para guardar tu progreso.</p>
              <div class="form-col">
                <label for="nameInput" class="label">Nombre / Nick</label>
                <input id="nameInput" class="input-lg" type="text" inputmode="text" autocomplete="name" placeholder="p. ej. AnaSMR" value="${state.profile.name||''}" aria-describedby="nameHelp" />
                <div id="nameHelp" class="help">Mín. 2 caracteres. Puedes cambiarlo cuando quieras.</div>
                <div class="form-row wrap">
                  <button class="btn btn-xl" id="btnSaveName">Guardar nombre</button>
                  <button class="btn btn-xl" id="btnNewUser">Borrar perfil</button>
                </div>
              </div>
            </div></div>

            
          </aside>
        </div>
      </div></div>
    </section>
  `;

  const enableContinue = ()=> {
    const name = $('#nameInput', root).value.trim();
    const btn = $('#btnContinue', root);
    if(name.length >= 2){ btn.removeAttribute('disabled'); } else { btn.setAttribute('disabled','disabled'); }
  };

  // Guardar nombre
  $('#btnSaveName', root)?.addEventListener('click', ()=>{
    const name = $('#nameInput', root).value.trim();
    if(name.length < 2){ announce('El nombre debe tener al menos 2 caracteres'); return; }
    setUser(state, name);
    refreshHeader(store.load());
    announce('Nombre guardado');
    enableContinue();
  });

  // Continuar
  $('#btnContinue', root)?.addEventListener('click', ()=>{
    if(!hasUser(state)) return;
    navigate('#dec2bin');
  });

  // Empezar de cero
  $('#btnStart', root)?.addEventListener('click', ()=>{
    if(!hasUser(state)){
      announce('Introduce y guarda tu nombre antes de empezar');
      $('#nameInput', root).focus();
      return;
    }
    showConfirm(root, {
      title: '¿Empezar de cero?',
      text: 'Se reiniciarán puntuación, progreso, racha y estadísticas. Tu nombre se mantiene.',
      onConfirm: ()=>{
        const fresh = defaultState();
        fresh.profile.name = state.profile.name; // conserva nombre
        localStorage.setItem('binTrainer.v2', JSON.stringify(fresh));
        refreshHeader(store.load());
        announce('Partida reiniciada');
        navigate('#dec2bin');
      }
    });
  });

  // Borrar perfil
  $('#btnNewUser', root)?.addEventListener('click', ()=>{
    showConfirm(root, {
      title: 'Borrar perfil',
      text: 'Eliminará el nombre y todo el progreso guardado. Esta acción no se puede deshacer.',
      onConfirm: ()=>{
        resetUser(state);
        refreshHeader(store.load());
        $('#nameInput', root).value = '';
        announce('Perfil borrado');
        enableContinue();
      }
    });
  });

  // Accesibilidad: habilitar/deshabilitar Continuar según nombre
  $('#nameInput', root)?.addEventListener('input', enableContinue);
  enableContinue();
  announce('Menú principal abierto');
}
