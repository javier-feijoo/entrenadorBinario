// ===============================
// js/router.js
// ===============================
// Router hash sencillo con registro de vistas.
const routes = new Map();
let notFound = null;


export function register(path, render){ routes.set(path, render); }
export function setNotFound(render){ notFound = render; }
export function navigate(path){ location.hash = path; }


export async function startRouter(){
window.addEventListener('hashchange', handle);
if(!location.hash){ location.hash = '#menu'; }
await handle();
}


async function handle(){
const root = document.getElementById('app-root');
const path = location.hash || '#menu';
const render = routes.get(path);
if(!render){ return notFound && notFound(root, {path}); }
await render(root, {path});
}

