'use strict';
/* Una sola voz a la vez. Los audios producidos se resuelven por personaje
   y texto; la síntesis del dispositivo queda como respaldo del contenido
   dinámico o todavía no producido. Nunca se llama a Higgsfield desde la web. */
const VOZ = { lista:[], actual:null, ultimo:null, preparada:false, turno:0, voces:[] };
const GUIA_MODULO = {guaca:'guacamayo', yaca:'ita', kapi:'kapi'};
const NOMBRES_VOZ = {kapi:'Kapi', guacamayo:'Tataendy', ita:'Itá', garza:'Yrupé', yarara:'Mbyja', caraya:'Yvytu', tortuga:'Yvy', yabiru:'Ñasaindy', arandu:'Arandu', yvoty:'Yvoty', jasy:'Jasy'};
const FESTEJOS_VOZ = {
  kapi:'¡Lo logramos! Gracias por explorar conmigo.',
  guacamayo:'¡Qué alegría! Seguimos descubriendo juntos.',
  ita:'¡Lo lograste! Paso a paso encontramos el camino.',
  garza:'¡Qué lindo aprender juntos! Vamos por otra aventura.',
  yarara:'¡Lo descubrimos! Sigamos explorando.',
  caraya:'¡Sí! ¡Lo logramos juntos!',
  tortuga:'¡Qué bien! Cada paso nos ayuda a aprender.',
  yabiru:'¡Una aventura más! Mirá todo lo que descubriste.'
};
const normalizarVoz = texto => texto.normalize('NFC').replace(/\s+/g,' ').trim();
function personajeGuia(){ return GUIA_MODULO[P.mod && P.mod.buddy] || 'kapi'; }
function detenerVoz(){
  VOZ.turno++;
  VOZ.lista=[];
  if(VOZ.actual && VOZ.actual.audio){ VOZ.actual.audio.pause(); VOZ.actual.audio.onended=null; VOZ.actual.audio.onerror=null; VOZ.actual.audio.remove(); }
  VOZ.actual=null;
  try{ window.speechSynthesis && window.speechSynthesis.cancel(); }catch(e){}
}
function textoVoz(mensaje){
  const texto=$('#voz-modal') || $('#voz-texto') || $('#narr-t');
  if(texto) texto.textContent=(NOMBRES_VOZ[mensaje.personaje] || 'Guía')+': '+mensaje.texto;
}
function speak(texto, opciones={}){
  if(!texto) return;
  const mensaje={texto:normalizarVoz(texto), personaje:opciones.personaje || personajeGuia(), manual:!!opciones.manual};
  if(!opciones.sumar) detenerVoz();
  VOZ.ultimo=mensaje;
  if(document.hidden || (!state.voz && !mensaje.manual)) return;
  VOZ.lista.push(mensaje);
  reproducirVoz();
}
function reproducirVoz(){
  if(!VOZ.preparada || VOZ.actual || !VOZ.lista.length) return;
  const mensaje=VOZ.lista.shift(), turno=VOZ.turno;
  VOZ.actual=mensaje;
  textoVoz(mensaje);
  const terminar=()=>{ if(turno!==VOZ.turno) return; VOZ.actual=null; reproducirVoz(); };
  let respaldado=false;
  const respaldo=()=>{
    if(turno!==VOZ.turno || respaldado) return;
    respaldado=true;
    if(mensaje.audio){mensaje.audio.pause();mensaje.audio.remove();}
    if(!('speechSynthesis' in window)){
      toast('La voz no está disponible. Podés seguir las indicaciones escritas.'); terminar(); return;
    }
    try{
      const u=new SpeechSynthesisUtterance(mensaje.texto);
      const voces=VOZ.voces.filter(v=>/^es(?:-|$)/i.test(v.lang));
      const elegida=voces.find(v=>/^es-AR$/i.test(v.lang)) || voces.find(v=>/^es-(MX|419)$/i.test(v.lang)) || voces[0];
      if(elegida) u.voice=elegida;
      u.lang=elegida?elegida.lang:'es-AR';u.rate=.92;u.pitch=1;
      u.onend=terminar;
      u.onerror=e=>{
        if(turno!==VOZ.turno) return;
        if(!['canceled','interrupted'].includes(e.error)) toast('No pudimos reproducir la voz. Tocá Repetir voz para intentarlo otra vez.');
        terminar();
      };
      mensaje.utterance=u;
      window.speechSynthesis.speak(u);
    }catch(e){ toast('La voz no está disponible. La indicación queda escrita.'); terminar(); }
  };
  const registro=typeof AUDIOS_VOZ!=='undefined' && AUDIOS_VOZ[mensaje.personaje+'|'+mensaje.texto];
  if(!registro){ respaldo(); return; }
  const audio=new Audio(registro); mensaje.audio=audio;
  audio.hidden=true;document.body.appendChild(audio);
  audio.onended=()=>{audio.remove();terminar();};
  audio.onerror=respaldo;
  audio.play().catch(e=>{
    if(turno!==VOZ.turno) return;
    // La preferencia sigue encendida; el navegador puede pedir otro gesto.
    if(e.name==='NotAllowedError'){
      audio.remove();VOZ.actual=null;VOZ.lista.unshift(mensaje);VOZ.preparada=false;
      toast('Tocá Repetir voz para escuchar la guía.');
    }else respaldo();
  });
}
function habilitarVoz(e){
  if(e.type==='keydown' && !['Enter',' ','Tab'].includes(e.key)) return;
  if(VOZ.preparada) return;
  VOZ.preparada=true; reproducirVoz();
}
document.addEventListener('pointerdown',habilitarVoz,{capture:true});
document.addEventListener('keydown',habilitarVoz,{capture:true});
document.addEventListener('visibilitychange',()=>{ if(document.hidden) detenerVoz(); });
window.addEventListener('pagehide',detenerVoz);
function cargarVoces(){
  try{ VOZ.voces=window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }catch(e){ VOZ.voces=[]; }
}
cargarVoces();
if(window.speechSynthesis && window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener('voiceschanged',cargarVoces);
function repetirVoz(){
  VOZ.preparada=true;
  const mensaje=VOZ.ultimo;
  if(mensaje) speak(mensaje.texto,{personaje:mensaje.personaje,manual:true});
}
function festejarVoz(final=false){
  const personaje=state.me || personajeGuia();
  const texto=final ? FESTEJOS_VOZ[personaje] : '¡Lo lograste! Tocá '+(P.i>=P.mod.stations.length-1?'Terminar':'Seguir')+' cuando quieras continuar.';
  if(!texto) return;
  speak(texto,{personaje,sumar:true});
}
function orientarVoz(parts){
  const [a,b,c]=parts;
  let texto='', personaje='kapi';
  if(!a) texto='¡Hola! Soy Kapi. Tocá Comenzar para entrar a Educa Primaria. Podés silenciar la voz cuando quieras.';
  else if(a==='inicio') texto='Para jugar, elegí Descubrir. Proyectar es para docentes y Acompañar es para las familias.';
  else if(a==='descubrir' && (!b || !state.me)) texto=state.me?'Elegí tu mundo. Podés entrar al Mundo de Kapi o al Río de Tataendy.':'¿Quién sos hoy? Elegí un compañero para tu cuaderno. Podés cambiarlo después.';
  else if(a==='descubrir' && !c){
    const w=WORLDS[+b];
    if(w && w.ready){ personaje=w.avatar==='guacamayo'?'guacamayo':'kapi';texto=w.mission+' Tocá un lugar del mapa para conocer su aventura.'; }
    else texto='Este mundo se está preparando. Podés elegir otro mundo.';
  }
  if(!texto) return;
  const panel=$('#voz-texto');if(panel) panel.textContent=texto;
  const saludo=state.saludoPendiente;
  state.saludoPendiente=null;
  if(saludo){
    const companero=COMPANEROS.find(c=>c[0]===saludo);
    if(companero) speak('Soy '+companero[1]+'. ¡Vamos a explorar juntos!',{personaje:saludo});
    speak(texto,{personaje,sumar:true});
  }else speak(texto,{personaje});
}
