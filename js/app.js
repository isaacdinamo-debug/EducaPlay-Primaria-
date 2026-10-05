'use strict';
/* ============ avance guardado en el dispositivo ============
   Sin cuentas ni datos personales: sólo qué aventuras terminó, qué dibujo
   eligió y si quiere la voz. Si el navegador no deja guardar, la app
   funciona igual y el avance dura lo que dura la pestaña. */
const CLAVE = 'educaplay-primaria-v2';
function guardar(){
  try{ localStorage.setItem(CLAVE, JSON.stringify({done:state.done, col:state.col, voz:state.voz, me:state.me})); }catch(e){}
}
function cargar(){
  try{
    const d = JSON.parse(localStorage.getItem(CLAVE)||'null'); if(!d) return;
    state.done = d.done||{}; state.col = d.col||[]; state.voz = !!d.voz; state.me = d.me||null;
    Object.values(WORLDS).forEach(w=>{ if(w.ready) w.nodes.forEach(n=>{ if(n.mod && state.done[n.mod]) state.seenScenery[w.id+':'+n.mod]=true; }); });
  }catch(e){}
}

/* ============ módulo infantil: ciclo de vida ============ */
function makeCtx(st){
  return {
    st, mod:P.mod,
    say(t){ const n=$('#narr-t'); if(n) n.textContent=t; P.last=t; if(!P.consigna) P.consigna=t; if(state.voz) speak(t); },
    buddy(mood){ const b=$('#buddy'); if(!b) return; b.classList.remove('happy','think'); void b.offsetWidth; b.classList.add(mood);
      if(mood==='happy') gestoCompanero($('video',b),'festeja'); },
    done(){
      const d=$$('#dots i')[P.i]; if(d){ d.classList.remove('on'); d.classList.add('ok'); }
      const nx=$('#next'); if(!nx) return;
      nx.hidden=false; nx.textContent = P.i>=P.mod.stations.length-1 ? '¡Terminar!' : 'Seguir';
      nx.onclick = nextStation;
      kapiEstado('anima');
    }
  };
}
function openStation(){
  clearTimers();
  const m=P.mod, st=m.stations[P.i]; if(!st) return;
  const stage=$('#stage'); stage.innerHTML='';
  const nx=$('#next'); nx.hidden=true;
  $$('#dots i').forEach((d,i)=>{ d.classList.toggle('on', i===P.i); if(i>=P.i) d.classList.remove('ok'); });
  $('#stage-wrap').classList.remove('paper');
  P.consigna=null; P.ayudas=0;
  kapiEstado('reposo'); reiniciarQuieto();
  STN[st.type](makeCtx(st), stage);
}
function nextStation(){
  if(P.i<P.mod.stations.length-1){ P.i++; openStation(); } else finishModule();
}
function finishModule(){
  clearTimers(); clearTimeout(relojQuieto); P.finished=true;
  const m=P.mod, w=WORLDS[m.grade];
  const yaEstaba = !!state.done[m.id];
  state.done[m.id]=true; if(!state.col.includes(m.id)){ state.col.push(m.id); state.nuevoHallazgo=true; }
  guardar();
  const lugar = w.nodes.find(n=>n.mod===m.id);
  $$('#dots i').forEach(d=>{ d.classList.remove('on'); d.classList.add('ok'); });
  $('#next').hidden=true;
  $('#stage').innerHTML = `<div class="finish">${state.me?`<div class="finish-yo">${companeroVivo(state.me,'festeja')}</div>`:''}<h2>¡Aventura completada!</h2>
    <div class="rew"><span class="rew-ico">${hallazgo(m.reward.icon)}</span><div><b>Encontraste: ${m.reward.name}</b><small>Ya está en tu cuaderno de campo.</small></div></div>
    ${!yaEstaba && lugar?`<p class="unlock">${ico('mapa')}Se despejó la niebla de ${lugar.zone}.</p>`:''}
    <div class="fila centro">
      <a class="btn btn-accion btn-big" href="#/descubrir/${m.grade}">${ico('mapa')}Volver al mapa</a>
      <button class="btn btn-big" data-act="share">${ico('casa')}Para casa</button>
      <button class="btn btn-big" data-act="replay">${ico('otro')}Jugar de nuevo</button></div></div>`;
  /* festejo: llueven pétalos de lapacho, una sola vez */
  const colores=['#f3a6c0','#f7c6d6','#efbb3f','#f3a6c0'];
  for(let i=0;i<22;i++){ const s=document.createElement('span'); s.className='confeti'; s.style.left=(6+Math.random()*88)+'%'; s.style.background=colores[i%4]; s.style.animationDelay=(Math.random()*.7)+'s'; $('#stage').appendChild(s); }
  const b=$('#buddy'); if(b){ b.classList.remove('think'); b.classList.add('happy'); }
  kapiEstado('celebra'); gestoCompanero($('#buddy video'),'festeja');
  const yo=$('.finish-yo video'); if(yo) yo.onended=()=>{ yo.onended=null; yo.loop=true; yo.src=`arte/companeros-video/${yo.dataset.quien}-reposo.webm`; yo.play().catch(()=>{}); };
  const msg='¡Aventura completada! Encontraste '+m.reward.name+'.';
  $('#narr-t').textContent=msg; P.last=msg; if(state.voz) speak(msg);
}

/* ============ Kapi por estados ============
   Cuando Kapi es el compañero del módulo, cambia de pose según lo que
   pasa: piensa si el chico se queda quieto un rato, anima cuando avanza
   y celebra al terminar. Son cuadros de sus videos, no dibujos nuevos. */
function kapiEstado(pose){ const k=$('#buddy .kapi-pose'); if(k) k.src='arte/kapi/'+pose+'.webp'; }
let relojQuieto=null;
function reiniciarQuieto(){
  clearTimeout(relojQuieto);
  if(!document.body.classList.contains('in-module') || P.finished) return;
  if($('#buddy .kapi-pose') && $('#buddy .kapi-pose').src.includes('piensa')) kapiEstado('reposo');
  relojQuieto=setTimeout(()=>kapiEstado('piensa'), 12000);
}
document.addEventListener('pointerdown', reiniciarQuieto);

/* ============ ventanas ============ */
function closeModal(){ const v=$('#veil'); if(v) v.remove(); }
function openModal(html){
  closeModal();
  const v=document.createElement('div'); v.className='veil'; v.id='veil'; v.dataset.veil='1'; v.innerHTML=html; document.body.appendChild(v);
  const f=$('button.x',v)||$('button',v); if(f) f.focus();
}
const CERRAR = `<button class="x" data-act="closeModal" aria-label="Cerrar">${boton('cerrar')}</button>`;
function openShare(id){
  const m=MODS[id]; if(!m) return;
  openModal(`<div class="sheet" role="dialog" aria-modal="true" aria-label="Llevate esta misión a casa">${CERRAR}
    <h2>Llevate esta misión a casa</h2>
    <div class="homebig"><span class="bigico">${glifo(m.icon)}</span><p class="carry">${m.card.voz}</p>
     <button class="btn-oir" data-act="say" data-text="${esc(m.card.voz)}" aria-label="Escuchar">${ico('parlante')}</button></div>
    <p>Quien te acompaña puede ver la propuesta completa: qué hacer, qué preguntar y cómo ayudarte.</p>
    <div class="fila"><a class="btn btn-accion btn-big" href="#/acompanar/tarjeta/${id}">Ver la propuesta</a><button class="btn btn-big" data-act="closeModal">Seguir jugando</button></div></div>`);
}
function openCuaderno(){
  const all=Object.values(MODS);
  openModal(`<div class="sheet" role="dialog" aria-modal="true" aria-label="Mi cuaderno de campo">${CERRAR}
   <h2>${state.me?companeroVivo(state.me,'reposo'):''}Mi cuaderno de campo</h2><p>Cada aventura completada deja un hallazgo. Encontraste ${state.col.length} de ${all.length}.</p>
   <div class="stickers">${all.map(m=>{ const f=state.done[m.id]; return `<div class="stk ${f?'':'off'}">${f?hallazgo(m.reward.icon):respaldo('incognita','')}<span>${f?m.reward.name:'Por descubrir'}</span></div>`; }).join('')}</div></div>`);
}

/* ============ router ============ */
function parseHash(){
  const h=(location.hash.slice(1)||'/').split('#')[0];
  const [path,qsr]=h.split('?');
  return { parts:path.split('/').filter(Boolean).map(decodeURIComponent), q:Object.fromEntries(new URLSearchParams(qsr||'')) };
}
function route(){
  clearTimers(); closeModal();
  const {parts,q}=parseHash(); const [a,b,c,d]=parts;
  let html='', zone='home', after=null;
  if(!a){ html=vIntro(); }
  else if(a==='inicio'){ html=vInicio(); }
  else if(a==='equipo'){ html=vEquipo(); }
  else if(a==='descubrir'){
    zone='descubrir';
    if(!b) html=vExplorar();
    else if(!state.me){ html=vElegir(); }
    else if(!c){ const g=+b; if(!WORLDS[g]){ location.hash='#/descubrir'; return; } html=vWorld(g); if(WORLDS[g].ready) after=()=>mountMap(g); }
    else if(c==='modulo' && MODS[d] && MODS[d].grade===+b){
      html=vModule(+b,d); P.mod=MODS[d]; P.i=Math.max(0,Math.min(+q.est||0,MODS[d].stations.length-1)); P.finished=false;
      after=()=>{ openStation(); };
    } else { location.hash='#/descubrir/'+(+b||''); return; }
  }
  else if(a==='proyectar'){
    zone='proyectar';
    if(!b) html=vProyectarHub();
    else if(b==='guias') html=vGuias(q);
    else if(b==='buscar') html=vSearch(q);
    else if(b==='modulo' && MODS[c]){ html=vSheet(c,q.tab); if(q.tab) after=()=>{ const s=$('#s-'+(q.tab==='sin-pantallas'?'sinpantallas':q.tab)); if(s) s.scrollIntoView({block:'start'}); }; }
    else if(b==='aprendizajes') html=vVerbos('proyectar',c);
    else if(b==='sin-pantallas' && !c) html=vSinPantallasList();
    else if(b==='sin-pantallas' && MODS[c]) html=vSinPantallasItem(c);
    else if(b==='recursos') html=vRecursosAula();
    else if(b==='cuaderno') html=vCuadernoList();
    else if(b==='que-pasa-si') html=vQuePasaSi();
    else { location.hash='#/proyectar'; return; }
  }
  else if(a==='acompanar'){
    zone='acompanar';
    if(!b) html=vAcomp();
    else if(b==='conocer') html=vConocer();
    else if(b==='estar-cerca') html=vEstarCerca();
    else if(b==='aprendizajes') html=vVerbos('acompanar',c);
    else if(b==='habitar' && !c) html=vHabitar();
    else if(b==='habitar' && HABITAR[c] && !d) html=vHabitar(c);
    else if(b==='habitar' && HABITAR[c] && d){ html=vHabitarItem(c,d); if(!html){ location.hash='#/acompanar/habitar/'+c; return; } }
    else if(b==='preguntas') html=vPreguntas(c);
    else if(b==='tarjeta' && MODS[c]) html=vTarjeta(c);
    else { location.hash='#/acompanar'; return; }
  }
  else { location.hash='#/inicio'; return; }
  const pintar = () => {
    const app=$('#app');
    app.dataset.zone=zone; app.innerHTML=html;
    document.body.classList.toggle('in-module', a==='descubrir' && c==='modulo');
    document.title = 'Educaplay Primaria · '+({home:'Inicio',descubrir:'Descubrir',proyectar:'Proyectar',acompanar:'Acompañar'}[zone]);
    window.scrollTo(0,0);
    const mn=$('#main'); if(mn) mn.focus({preventScroll:true});
    if(after) after();
    state.nuevoHallazgo=false;
  };
  /* La pantalla nueva entra deslizándose. Si el navegador no sabe hacer la
     transición, o el dispositivo pide menos movimiento, cambia de una. */
  if(document.startViewTransition && !SIN_MOVIMIENTO && primeraPintada) document.startViewTransition(pintar); else pintar();
  primeraPintada=true;
}
let primeraPintada=false;
window.addEventListener('hashchange', route);

/* ============ eventos ============ */
const ACT = {
  voz(){ state.voz=!state.voz; guardar();
    $$('[data-act="voz"]').forEach(b=>{ b.classList.toggle('on',state.voz); b.setAttribute('aria-pressed',state.voz); });
    toast(state.voz?'Voz activada':'Voz apagada'); if(state.voz && P.last && $('#narr-t')) speak(P.last); if(!state.voz){ try{speechSynthesis.cancel();}catch(e){} } },
  speak(){ if(P.last){ speak(P.last); if(!('speechSynthesis' in window)) toast(P.last); } },
  say(el){ const t=el.dataset.text; speak(t); if(!('speechSynthesis' in window)) toast(t); },
  share(){ if(P.mod) openShare(P.mod.id); },
  closeModal(){ closeModal(); },
  cuaderno(){ openCuaderno(); },
  popclose(){ closePop(); },
  node(el){ openPop(el.dataset.node); },
  /* El compañero es un botón: la primera vez repite la consigna; la
     siguiente, si la actividad tiene pista, la da. Siempre en voz alta. */
  ayuda(el){
    const st=P.mod && P.mod.stations[P.i]; P.ayudas=(P.ayudas||0)+1;
    const pista = st && st.hint && P.ayudas>1 ? 'Una pista: '+st.hint : (P.consigna||P.last);
    if(!pista) return;
    const n=$('#narr-t'); if(n) n.textContent=pista;
    speak(pista); if(!('speechSynthesis' in window)) toast(pista);
    gestoCompanero($('video',el),'saluda'); kapiEstado('anima');
  },
  replay(){ P.i=0; P.finished=false; $$('#dots i').forEach(d=>d.className=''); openStation(); },
  toast(el){ toast(el.dataset.msg); },
  print(){ window.print(); },
  /* El elegido salta y los demás se apartan; después sigue el recorrido. */
  elegirme(el){
    if(state.me) return;
    state.me=el.dataset.me; guardar();
    if(SIN_MOVIMIENTO){ route(); return; }
    $$('.comp').forEach(c=>c.classList.add(c===el?'elegida':'aparta'));
    const v=$('video',el); gestoCompanero(v,'saluda');
    setTimeout(route, v&&v.dataset.quien?2700:650);
  },
  cambiarme(){ state.me=null; guardar(); location.hash='#/descubrir'; route(); },
  reiniciar(){ state.done={}; state.col=[]; state.seenScenery={}; state.avatar={}; state.me=null; guardar(); toast('Avance reiniciado'); },
  saltar(el,e){ e.preventDefault(); const m=$('#main'); if(m){ m.focus(); m.scrollIntoView(); } },
  tab(el){
    const k=el.dataset.tab;
    $$('[role="tab"]').forEach(t=>{ const on=t===el; t.setAttribute('aria-selected',on); t.tabIndex=on?0:-1; });
    $$('[role="tabpanel"]').forEach(p=>p.hidden = p.id!=='p-'+k);
  }
};
document.addEventListener('click', e=>{
  if(e.target.matches && e.target.matches('[data-veil]')){ closeModal(); return; }
  const nd=e.target.closest('[data-node]');
  if(nd && nd.closest('#map') && !nd.matches('[data-act]')){ openPop(nd.dataset.node); return; }
  const act=e.target.closest('[data-act]');
  if(act && ACT[act.dataset.act]){ ACT[act.dataset.act](act,e); return; }
  if(!e.target.closest('#pop')) closePop();
});
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ closeModal(); closePop(); }
  if((e.key==='Enter'||e.key===' ') && e.target.matches && e.target.matches('.node')){ e.preventDefault(); openPop(e.target.dataset.node); }
  if((e.key==='ArrowRight'||e.key==='ArrowLeft') && e.target.matches && e.target.matches('[role="tab"]')){
    const tabs=$$('[role="tab"]'); const i=tabs.indexOf(e.target); const n=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length]; n.focus(); n.click();
  }
});
document.addEventListener('submit', e=>{
  const f=e.target.closest('[data-form="search"]'); if(!f) return;
  e.preventDefault();
  const v=new FormData(f).get('q')||'';
  location.hash='#/proyectar/buscar?q='+encodeURIComponent(v);
});
/* Al imprimir la ficha docente salen los tres momentos, no sólo el abierto. */
window.addEventListener('beforeprint', ()=>{
  $$('.ficha .tpanel').forEach(p=>{ p.dataset.oculto=p.hidden?'1':''; p.hidden=false; });
  $$('#app details').forEach(d=>{ d.dataset.abierto=d.open?'1':''; d.open=true; });
});
window.addEventListener('afterprint', ()=>{
  $$('.ficha .tpanel').forEach(p=>{ p.hidden=p.dataset.oculto==='1'; });
  $$('#app details').forEach(d=>{ d.open=d.dataset.abierto==='1'; });
});

/* ============ arranque ============ */
document.addEventListener('DOMContentLoaded', ()=>{
    cargar();
  route();
});
