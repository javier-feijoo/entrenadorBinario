// ===============================
// js/app.js
// ===============================
import { store } from './store.js';
import { audio } from './audio.js';
import { setWelcome, enableHeaderNav } from './ui.js';
import { register, setNotFound, startRouter, navigate } from './router.js';
import { refreshHeader } from './ui.js';


// Vistas
import { renderMenu } from './views/menu.js';
import { renderDec2Bin } from './views/dec2bin.js';
import { renderBin2Dec } from './views/bin2dec.js';
import { renderStats } from './views/stats.js';
import { renderSettings } from './views/settings.js';


function $$ (sel, root=document){ return Array.from(root.querySelectorAll(sel)); }


function bindHeaderNav(){
// Botones de cabecera -> cambian el hash mediante el router
$$('.main-nav .nav').forEach(btn => {
btn.addEventListener('click', () => {
const to = btn.getAttribute('data-to');
if(to) navigate(to);
});
});
}


async function bootstrap(){
// Cargar estado inicial y preparar sistema de audio
const state = store.load();
audio.init();
refreshHeader(state);

// HUD de cabecera
setWelcome(state);
enableHeaderNav(state);


// Enlaces de navegación del header
bindHeaderNav();


// Registro de rutas de la SPA
register('#menu', renderMenu);
register('#dec2bin', renderDec2Bin);
register('#bin2dec', renderBin2Dec);
register('#stats', renderStats);
register('#settings', renderSettings);


// Vista por defecto si no existe la ruta
setNotFound((root)=>{ root.innerHTML = '<section class="view-card"><div class="card"><div class="pad"><p>Vista no encontrada.</p></div></div></section>'; });


// Refrescar accesos del header cuando cambie la ruta (por si cambia el usuario/estado)
window.addEventListener('hashchange', () => {
const s = store.load();
refreshHeader(state);
});


// Lanzar el router
await startRouter();
}


bootstrap().catch(err => {
console.error('[Bootstrap error]', err);
const root = document.getElementById('app-root');
if(root){
root.innerHTML = '<section class="view-card"><div class="card"><div class="pad"><p>Ha ocurrido un error iniciando la aplicación.</p></div></div></section>';
}
});