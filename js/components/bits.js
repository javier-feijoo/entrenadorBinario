// ===============================
// js/components/bits.js
// ===============================
// Componente de 8 bits accesibles. Devuelve API para leer/escribir y limpiar.
export function createBits(container, {readonly=false, onToggle} = {}){
const box = (typeof container==='string')? document.querySelector(container) : container;
if(!box) throw new Error('container no encontrado');
box.innerHTML = '';
const buttons = [];
for(let i=0;i<8;i++){
const b = document.createElement('button');
b.className = 'bit';
b.setAttribute('data-on','0');
b.setAttribute('aria-pressed','false');
b.textContent = '0';
if(readonly){ b.setAttribute('disabled','disabled'); }
b.addEventListener('click', ()=> toggle(b));
b.addEventListener('keydown', (e)=>{
if(e.key===' '||e.key==='Enter'){ e.preventDefault(); toggle(b); }
});
box.appendChild(b); buttons.push(b);
}
function toggle(b){
if(readonly) return;
const now = b.getAttribute('data-on')==='1'? '0':'1';
b.setAttribute('data-on', now);
b.setAttribute('aria-pressed', now==='1'?'true':'false');
b.textContent = now;
onToggle && onToggle(toString());
}
function toString(){ return buttons.map(x=> x.getAttribute('data-on')).join(''); }
function setFromString(str){ str.split('').forEach((ch,i)=>{ const v=(ch==='1'); const b=buttons[i]; if(!b) return; b.setAttribute('data-on', v?'1':'0'); b.setAttribute('aria-pressed', v?'true':'false'); b.textContent = v?'1':'0'; }); }
function clear(){ setFromString('00000000'); }
return { toString, setFromString, clear, el: box };
}