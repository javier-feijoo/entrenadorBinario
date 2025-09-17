// ===============================
// js/audio.js
// ===============================
export const audio = {
els: {},
init(){
this.els = {
click: document.getElementById('audio-click'),
success:document.getElementById('audio-success'),
error: document.getElementById('audio-error'),
level: document.getElementById('audio-level')
};
},
play(id){
const el = this.els[id];
if(!el) return; try { el.currentTime = 0; el.play(); } catch(e){}
}
};

