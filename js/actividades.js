/* Utilidades y actividades de los módulos, sin cambios de lógica respecto
   del prototipo original. */
/* ============ utilidades ============ */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const rnd = n => Math.floor(Math.random()*n);
const shuffle = a => { a=[...a]; for(let i=a.length-1;i>0;i--){ const j=rnd(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const norm = s => (s||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const esc = s => String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const state = { done:{}, col:[], voz:false, me:null, seenUnlocked:{}, seenScenery:{}, avatar:{} };
const P = { mod:null, i:0, timers:[], finished:false };

function later(fn, ms){ const t=setTimeout(fn,ms); P.timers.push(t); return t; }
function clearTimers(){ P.timers.forEach(clearTimeout); P.timers=[]; try{ speechSynthesis.cancel(); }catch(e){} }
function speak(t){
  try{
    if(!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t); u.lang='es-AR'; u.rate=.92; u.pitch=1.1;
    speechSynthesis.speak(u);
  }catch(e){}
}
function toast(msg){
  let t=$('#toast'); if(!t) return;
  t.textContent=msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('on'),2600);
}

/* ---- arrastrar / tocar (mouse, touch y lápiz) ---- */
function drag(node, o){
  let id=null, sx=0, sy=0, moving=false;
  node.style.touchAction='none';
  const clearOver = ()=> $$('.over').forEach(e=>e.classList.remove('over'));
  const under = (x,y)=>{
    const els = document.elementsFromPoint(x,y);
    for(const e of els){ const t=e.closest && e.closest('[data-drop]'); if(t && t!==node && !node.contains(t)) return t; }
    return null;
  };
  node.addEventListener('pointerdown', e=>{
    if(o.canDrag && !o.canDrag()) { return; }
    id=e.pointerId; sx=e.clientX; sy=e.clientY; moving=false;
    try{ node.setPointerCapture(id); }catch(_){}
  });
  node.addEventListener('pointermove', e=>{
    if(id===null || e.pointerId!==id) return;
    const dx=e.clientX-sx, dy=e.clientY-sy;
    if(!moving && Math.hypot(dx,dy)>8){ moving=true; node.classList.add('dragging'); }
    if(moving){
      node.style.transform=`translate(${dx}px,${dy}px) scale(1.15)`;
      clearOver(); const t=under(e.clientX,e.clientY); if(t && (!o.accept || o.accept(t))) t.classList.add('over');
    }
  });
  const finish = (e,cancel)=>{
    if(id===null || e.pointerId!==id) return;
    try{ node.releasePointerCapture(id); }catch(_){}
    id=null; node.classList.remove('dragging'); clearOver();
    if(!moving){ node.style.transform=''; if(!cancel && o.onTap) o.onTap(); return; }
    const t = cancel ? null : under(e.clientX,e.clientY);
    node.style.transform='';
    if(t && (!o.accept || o.accept(t))) o.onDrop && o.onDrop(t);
    else o.onMiss && o.onMiss();
  };
  node.addEventListener('pointerup', e=>finish(e,false));
  node.addEventListener('pointercancel', e=>finish(e,true));
  node.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); if(!o.canDrag||o.canDrag()) o.onTap && o.onTap(); } });
}

/* ---- pequeños generadores de HTML ---- */
const PIPS = {1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function diceHTML(n, cls='', k=0, pair=false){
  if(n===null) return `<div class="dice blank" role="img" aria-label="Dado sin tirar">${'<i></i>'.repeat(9)}</div>`;
  const on=PIPS[n]; let idx=0, s='';
  for(let i=0;i<9;i++){
    if(on.includes(i)){ const c = pair ? (idx<k?'lit':'miss') : ''; s+=`<i class="pip ${c}"></i>`; idx++; } else s+='<i></i>';
  }
  return `<div class="dice ${cls}" role="img" aria-label="Dado con ${n} puntos">${s}</div>`;
}
function seeded(seed){ let s=seed*7919+13; return ()=> (s=(s*9301+49297)%233280)/233280; }
function scatter(n, seed){
  const rnd2=seeded(seed);
  const cells=[[6,14],[36,10],[64,14],[8,52],[38,56],[66,52]];
  const order=shuffle(cells.map((c,i)=>i)).slice(0,n);
  return order.map(i=>`left:${cells[i][0]+rnd2()*6}%;top:${cells[i][1]+rnd2()*8}%`);
}
function pileHTML(n, seed){ return scatter(n,seed).map(p=>`<span class="fruit" style="${p}">${FRUIT}</span>`).join(''); }
function alignHTML(a,b){
  const m=Math.max(a,b); let s=`<div class="align" style="grid-template-columns:repeat(${m},auto)">`;
  for(let i=0;i<m;i++){
    const both=i<a&&i<b;
    s+=`<div class="c ${both?'par':'solo'}">${i<a?`<span class="fruit">${FRUIT}</span>`:'<div class="gap"></div>'}${i<b?`<span class="fruit">${FRUIT}</span>`:'<div class="gap"></div>'}</div>`;
  }
  return s+'</div>';
}
const AV_GUACA = glifo('guacamayo');
const AV_KAPI = kapiPose('reposo');

const STN = {};

/* =========================================================
   Estación 1 — El dado del guacamayo
   ========================================================= */
STN['f-dado'] = (ctx, root) => {
  const POS=[[30,20],[52,8],[72,20],[18,38],[42,30],[62,36],[80,38],[50,50]];
  const auto = [true,false,false];
  let r=0, n=null, k=0, rolling=false, lastDrop=-1, pair=false, checked=false, prev=0, extra=false;
  root.innerHTML = `<div class="scene">
    <div class="treewrap">${TREE_SCENE}<div id="tfr"></div></div>
    <div class="mid"><div id="dice"></div>
      <button class="btn btn-sun btn-big" id="roll">Tirar el dado</button>
      <button class="btn btn-primary btn-big" id="go" hidden>Seguir</button>
      <div class="rounds" id="rd" aria-label="Rondas"></div></div>
    <div class="cestawrap"><div class="cesta" id="cesta" data-drop="cesta"><span class="cwho">Cesta de Kapi</span><div class="cesta-in" id="cin"></div></div>
      <button class="btn btn-primary btn-big" id="ok" hidden>¡Listo!</button></div>
  </div>`;
  const canPlace = () => !auto[r] && !checked;
  function drawDice(){ $('#dice',root).innerHTML = diceHTML(n, rolling?'rolling':'', k, pair); }
  function drawTree(){
    $('#tfr',root).innerHTML = POS.slice(0, 8-k).map((p,i)=>`<button class="fruit tf" style="left:${p[0]}%;top:${p[1]}%" aria-label="Fruto del árbol">${FRUIT}</button>`).join('');
    $$('.tf',root).forEach(b=>drag(b,{canDrag:canPlace,accept:t=>t.dataset.drop==='cesta',onDrop:add,onTap:add}));
  }
  function drawCesta(){
    $('#cin',root).innerHTML = Array.from({length:k},(_,i)=>`<button class="fruit ${i===lastDrop?'fall':''} ${extra&&n!==null&&i>=n?'extra':''}" data-i="${i}" aria-label="Fruto en la cesta. Tocá para sacarlo">${FRUIT}</button>`).join('');
    $$('#cin .fruit',root).forEach(b=>b.onclick=rem);
  }
  const drawAll = () => { drawDice(); drawTree(); drawCesta(); };
  function add(){
    if(auto[r]||checked) return;
    if(n===null){ ctx.say('Primero tirá el dado.'); return; }
    if(k>=8) return;
    k++; lastDrop=k-1; pair=false; extra=false; drawAll();
  }
  function rem(){ if(auto[r]||checked||k===0) return; k--; lastDrop=-1; pair=false; extra=false; drawAll(); }
  function rounds(){ $('#rd',root).innerHTML = auto.map((_,i)=>`<i class="${i<r?'ok':i===r?'on':''}"></i>`).join(''); }
  function startRound(i){
    r=i; n=null; k=0; lastDrop=-1; pair=false; checked=false; rolling=false; extra=false;
    $('#roll',root).hidden=false; $('#roll',root).disabled=false; $('#go',root).hidden=true; $('#ok',root).hidden=true;
    $('#cesta',root).classList.remove('ok'); rounds(); drawAll();
    ctx.say(i===0 ? 'Soy Tataendy. Tiro el dado y el árbol deja caer un fruto por cada puntito. ¡Mirá!' : 'Ahora te toca a vos. Tirá el dado y llená la cesta con tantos frutos como puntitos.');
  }
  $('#roll',root).onclick = () => {
    if(rolling||n!==null) return;
    rolling=true; $('#roll',root).disabled=true;
    let t=0;
    const tick = () => {
      $('#dice',root).innerHTML = diceHTML(1+rnd(6),'rolling');
      if(++t<10){ later(tick,90); return; }
      let x; do{ x=2+rnd(4); }while(x===prev); prev=x; n=x; rolling=false;
      $('#roll',root).hidden=true;
      if(auto[r]){
        pair=true; drawDice();
        ctx.say('¡Salieron estos puntitos! Cae un fruto por cada uno.');
        for(let i=0;i<n;i++) later(()=>{ k++; lastDrop=k-1; drawAll(); }, 700+i*700);
        later(()=>{ ctx.say('¡Un fruto para cada puntito! Ahora te toca a vos.'); ctx.buddy('happy'); $('#cesta',root).classList.add('ok'); const g=$('#go',root); g.textContent='Ahora me toca a mí'; g.hidden=false; }, 900+n*700);
      } else {
        drawDice(); $('#ok',root).hidden=false;
        ctx.say('Salió el dado. Llená la cesta con tantos frutos como puntitos. Podés arrastrar los frutos del árbol.');
      }
    };
    tick();
  };
  $('#go',root).onclick = () => startRound(r+1);
  $('#ok',root).onclick = () => {
    if(n===null||checked) return;
    pair=true;
    if(k===n){
      checked=true; extra=false; drawAll(); ctx.buddy('happy'); $('#cesta',root).classList.add('ok'); $('#ok',root).hidden=true;
      ctx.say('¡Sí! Pusiste un fruto por cada puntito.');
      if(r<2){ const g=$('#go',root); g.textContent='Otra vez'; g.hidden=false; } else ctx.done();
    } else {
      extra = k>n; drawAll(); ctx.buddy('think');
      ctx.say(k<n ? 'Todavía faltan frutos. Mirá los puntitos rojos: les falta un fruto.' : 'Hay frutos de más. Sacá los que se mueven.');
      later(()=>{ pair=false; extra=false; drawAll(); }, 3000);
    }
  };
  startRound(0);
};

/* =========================================================
   Estación 2 — ¿Quién tiene más?
   ========================================================= */
STN['f-comparar'] = (ctx, root) => {
  const RS=[{a:3,b:5,q:'¿Quién tiene más frutos?',ans:'b'},{a:6,b:4,q:'¿Quién tiene menos frutos?',ans:'b'},{a:4,b:4,q:'¿Quién tiene más frutos?',ans:'i'}];
  let r=0, aligned=false, answered=false;
  root.innerHTML = `<div class="qtxt" id="q"></div>
    <div class="duo" id="duo"></div>
    <div class="tools"><button class="btn btn-big" id="fila">Ponerlos en fila</button><button class="btn btn-primary btn-big" id="nr" hidden>Otra pregunta</button></div>
    <div class="answers">
      <button class="ans" data-a="a">${AV_GUACA} Tataendy</button>
      <button class="ans" data-a="b">${AV_KAPI} Kapi</button>
      <button class="ans" data-a="i">Tienen igual</button></div>`;
  function draw(){
    const R=RS[r];
    $('#q',root).textContent = R.q;
    $('#duo',root).innerHTML = aligned
      ? `<div style="grid-column:1/-1">${alignHTML(R.a,R.b)}<p style="text-align:center;margin-top:6px;font-weight:700;color:#0b3d38">Arriba: Tataendy · Abajo: Kapi</p></div>`
      : `<div class="pile"><span class="lbl">Tataendy</span>${pileHTML(R.a, r*3+1)}</div><div class="pile"><span class="lbl">Kapi</span>${pileHTML(R.b, r*3+2)}</div>`;
    $('#fila',root).textContent = aligned ? 'Volver a como estaban' : 'Ponerlos en fila';
  }
  function start(i){
    r=i; aligned=false; answered=false; $('#nr',root).hidden=true; $('#fila',root).hidden=false;
    $$('.ans',root).forEach(b=>b.classList.remove('good','bad')); draw();
    ctx.say(i===0 ? 'Tataendy y Kapi juntaron frutos. Mirá bien cada cesta y contestá.' : 'Otra vez. Mirá bien y contestá.');
  }
  $('#fila',root).onclick = () => { aligned=!aligned; draw(); if(aligned) ctx.say('Uno debajo del otro se ve mejor. Fijate si a alguien le sobra un fruto.'); };
  $$('.ans',root).forEach(b=>b.onclick=()=>{
    if(answered) return;
    if(b.dataset.a===RS[r].ans){
      answered=true; b.classList.add('good'); aligned=true; draw(); ctx.buddy('happy');
      ctx.say(RS[r].ans==='i' ? '¡Sí! Tienen la misma cantidad: a cada fruto le toca su pareja.' : '¡Sí! Puestos en fila, se ve a quién le sobran frutos.');
      if(r<RS.length-1){ $('#nr',root).hidden=false; } else ctx.done();
    } else {
      b.classList.add('bad'); ctx.buddy('think');
      ctx.say('Mmm, no estoy seguro. ¿Y si los ponemos en fila, uno debajo del otro?');
      $('#fila',root).classList.add('btn-sun');
    }
  });
  $('#nr',root).onclick = () => start(r+1);
  start(0);
};

/* =========================================================
   Estación 3 — Un fruto para cada pichón
   ========================================================= */
STN['f-pichones'] = (ctx, root) => {
  const RS=[{p:4,f:5},{p:4,f:3}];
  let r=0, slots=[], pool=0, answered=false, hintOn=false;
  root.innerHTML = `<div class="qtxt" id="q">Un fruto para cada pichón</div>
    <div class="nest" id="nest"></div>
    <div class="pool" id="pool"></div>
    <div class="answers" id="ans" hidden>
      <button class="ans" data-a="sobran">${FRUIT} Sobraron frutos</button>
      <button class="ans" data-a="faltan">${objeto("pichon")} Faltaron frutos</button>
      <button class="ans" data-a="justo">Alcanzaron justo</button></div>
    <div class="tools"><button class="btn btn-primary btn-big" id="nr" hidden>Otra vez</button></div>`;
  const full = () => !slots.includes(false);
  function fillSlot(i){ if(slots[i]||pool===0||answered) return; slots[i]=true; pool--; hintOn=false; draw(); }
  function placeFirst(){ const i=slots.indexOf(false); if(i>=0) fillSlot(i); }
  function draw(){
    $('#nest',root).innerHTML = slots.map((f,i)=>`<div class="slot ${f?'full':''} ${hintOn&&!f?'miss':''}" data-drop="slot" data-i="${i}"><span class="chick">${objeto("pichon")}</span>${f?`<button class="fruit" data-back="${i}" aria-label="Sacar el fruto">${FRUIT}</button>`:''}</div>`).join('');
    $$('[data-back]',root).forEach(b=>b.onclick=()=>{ if(answered) return; slots[+b.dataset.back]=false; pool++; draw(); });
    $('#pool',root).innerHTML = pool>0 ? Array.from({length:pool},(_,i)=>`<button class="fruit ${hintOn&&full()?'extra':''}" aria-label="Fruto para repartir">${FRUIT}</button>`).join('') : '<span style="font-family:var(--f-kid);font-weight:800;color:#0b3d38">No quedan frutos</span>';
    $$('#pool .fruit',root).forEach(b=>drag(b,{
      canDrag:()=>!answered, accept:t=>t.dataset.drop==='slot' && !slots[+t.dataset.i],
      onDrop:t=>fillSlot(+t.dataset.i), onTap:placeFirst }));
    const ready = full() || pool===0;
    $('#ans',root).hidden = !ready;
    if(ready && !answered) ctx.say('¿Qué pasó con los frutos? Mirá los pichones y los frutos.');
  }
  function start(i){
    r=i; slots=Array(RS[i].p).fill(false); pool=RS[i].f; answered=false; hintOn=false;
    $$('.ans',root).forEach(b=>b.classList.remove('good','bad')); $('#nr',root).hidden=true; draw();
    ctx.say(i===0?'Los pichones tienen hambre. Llevale un fruto a cada uno. Arrastrá o tocá los frutos.':'Otra vez: un fruto para cada pichón.');
  }
  $$('.ans',root).forEach(b=>b.onclick=()=>{
    if(answered) return;
    const correct = full() && pool>0 ? 'sobran' : (!full() && pool===0 ? 'faltan' : 'justo');
    if(b.dataset.a===correct){
      answered=true; b.classList.add('good'); ctx.buddy('happy');
      ctx.say(correct==='sobran'?'¡Sí! Cada pichón tiene su fruto y todavía quedan frutos.':correct==='faltan'?'¡Sí! Hay pichones sin fruto: faltaron frutos.':'¡Justo! Un fruto para cada pichón.');
      if(r<RS.length-1) $('#nr',root).hidden=false; else ctx.done();
    } else {
      b.classList.add('bad'); ctx.buddy('think'); hintOn=true; draw();
      ctx.say('Miremos otra vez: ¿quedó algún pichón sin fruto? ¿Quedó algún fruto sin pichón?');
    }
  });
  $('#nr',root).onclick = () => start(r+1);
  start(0);
};

/* =========================================================
   Estación 4 — La cesta gemela
   ========================================================= */
STN['f-gemela'] = (ctx, root) => {
  const TG=[5,3]; let r=0, k=0, compare=false, won=false;
  root.innerHTML = `<div class="qtxt">Armá otra cesta con tantos frutos como esta</div>
    <div class="duo" id="duo"></div><div id="cmp"></div>
    <div class="pool" id="pool"></div>
    <div class="tools"><button class="btn btn-primary btn-big" id="cmpbtn">${ico("buscar")}Comparar</button><button class="btn btn-big" id="back" hidden>Seguir armando</button><button class="btn btn-primary btn-big" id="nr" hidden>Otra vez</button></div>`;
  function draw(){
    const t=TG[r];
    $('#duo',root).style.display = compare?'none':'';
    $('#cmp',root).innerHTML = compare ? alignHTML(t,k)+`<p style="text-align:center;margin-top:6px;font-weight:700;color:#0b3d38">Arriba: cesta de Kapi · Abajo: tu cesta</p>` : '';
    $('#duo',root).innerHTML = `<div class="pile"><span class="lbl">Cesta de Kapi</span>${pileHTML(t, 20+r)}</div>
      <div class="cesta" id="mine" data-drop="cesta"><span class="cwho">Tu cesta</span><div class="cesta-in">${Array.from({length:k},()=>`<button class="fruit" aria-label="Sacar fruto">${FRUIT}</button>`).join('')}</div></div>`;
    $$('#mine .fruit',root).forEach(b=>b.onclick=()=>{ if(won) return; k--; draw(); });
    $('#pool',root).innerHTML = Array.from({length:8-k},()=>`<button class="fruit" aria-label="Fruto del árbol">${FRUIT}</button>`).join('');
    $$('#pool .fruit',root).forEach(b=>drag(b,{canDrag:()=>!won&&!compare,accept:t=>t.dataset.drop==='cesta',onDrop:()=>{k++;draw();},onTap:()=>{k++;draw();}}));
    $('#pool',root).style.display = compare?'none':'';
  }
  function start(i){ r=i;k=0;compare=false;won=false; $('#cmpbtn',root).hidden=false; $('#back',root).hidden=true; $('#nr',root).hidden=true; draw();
    ctx.say(i===0?'Kapi tiene una cesta. Llená la tuya con la misma cantidad de frutos. Después tocá Comparar.':'Ahora otra cesta distinta. ¡Armá la gemela!'); }
  $('#cmpbtn',root).onclick = () => {
    compare=true; draw(); $('#cmpbtn',root).hidden=true;
    if(k===TG[r]){
      won=true; ctx.buddy('happy'); ctx.say('¡Son gemelas! Cada fruto tiene su pareja.');
      if(r<TG.length-1) $('#nr',root).hidden=false; else ctx.done();
    } else {
      $('#back',root).hidden=false; ctx.buddy('think');
      ctx.say(k<TG[r] ? 'Mirá: a tu cesta le faltan frutos. Se ven los huecos rojos.' : 'Mirá: tu cesta tiene frutos de más.');
    }
  };
  $('#back',root).onclick = () => { compare=false; $('#cmpbtn',root).hidden=false; $('#back',root).hidden=true; draw(); ctx.say('Seguí armando tu cesta y volvé a comparar.'); };
  $('#nr',root).onclick = () => start(r+1);
  start(0);
};

/* =========================================================
   Estación 5 — El cuaderno de piedritas (registro)
   ========================================================= */
STN['f-cuaderno'] = (ctx, root) => {
  const TG=[4,6]; let r=0, marks=[], type='p1', won=false;
  root.innerHTML = `<div class="cuad">
    <div class="pile" id="pl" style="width:min(470px,96%)"></div>
    <div class="qtxt" style="margin-top:6px">Anotá cuántos frutos hay</div>
    <div class="book" id="book" aria-label="Cuaderno"></div>
    <div class="tools" role="group" aria-label="Elegí cómo anotar">
      <button class="marker" data-t="p1" aria-pressed="true"><span class="mk" style="animation:none;width:22px;height:22px"></span> Piedritas</button>
      <button class="marker" data-t="p2" aria-pressed="false"><span class="mk p2" style="animation:none;height:26px"></span> Palitos</button>
      <button class="marker" data-t="p3" aria-pressed="false"><span class="mk p3" style="animation:none;margin:0"></span> Puntitos</button></div>
    <div class="tools"><button class="btn btn-sun btn-big" id="add">Anotar</button><button class="btn btn-big" id="undo">Borrar</button><button class="btn btn-primary btn-big" id="ok">¡Listo!</button><button class="btn btn-primary btn-big" id="nr" hidden>Otra vez</button></div></div>`;
  function draw(){
    $('#pl',root).innerHTML = `<span class="lbl">Frutos de Tataendy</span>${pileHTML(TG[r], 40+r)}`;
    $('#book',root).innerHTML = marks.map(m=>`<span class="mk ${m}"></span>`).join('');
    $$('.marker',root).forEach(b=>b.setAttribute('aria-pressed', b.dataset.t===type));
  }
  function start(i){ r=i; marks=[]; won=false; $('#nr',root).hidden=true; $('#ok',root).hidden=false; draw();
    ctx.say(i===0?'Tataendy quiere acordarse de cuántos frutos juntó. Anotá una marca por cada fruto. Elegí cómo anotar.':'Ahora hay otra cesta. Anotá de nuevo, como más te guste.'); }
  $$('.marker',root).forEach(b=>b.onclick=()=>{ type=b.dataset.t; draw(); });
  $('#add',root).onclick = () => { if(won||marks.length>=12) return; marks.push(type==='p1'?'':type); draw(); };
  $('#undo',root).onclick = () => { if(won) return; marks.pop(); draw(); };
  $('#ok',root).onclick = () => {
    if(won) return;
    if(marks.length===TG[r]){
      won=true; $('#ok',root).hidden=true; ctx.buddy('happy');
      ctx.say('¡Quedó anotado! Ahora se puede saber cuántos frutos había sin mirar la cesta.');
      if(r<TG.length-1) $('#nr',root).hidden=false; else ctx.done();
    } else { ctx.buddy('think'); ctx.say(marks.length<TG[r]?'Todavía faltan marcas. Contá los frutos uno por uno.':'Hay marcas de más. Contá los frutos y borrá las que sobran.'); }
  };
  $('#nr',root).onclick = () => start(r+1);
  start(0);
};

/* =========================================================
   Actividades genéricas (reutilizables por cualquier módulo)
   ========================================================= */
STN.ordenar = (ctx, root) => {
  const st=ctx.st, N=st.items.length; let next=0;
  root.innerHTML = `<div class="act"><div class="strip" id="strip">${st.items.map((_,i)=>`<div class="slotmark" data-s="${i}">${i+1}</div>`).join('')}</div>
    <div class="strip" id="cards">${st.order.map(i=>`<button class="pcard" data-i="${i}"><span class="em">${dib(st.items[i].em)}</span>${esc(st.items[i].t)}</button>`).join('')}</div></div>`;
  ctx.say(st.intro);
  $$('#cards .pcard',root).forEach(c=>c.onclick=()=>{
    const i=+c.dataset.i;
    if(state.voz) speak(st.items[i].t);
    if(i===next){
      const slot=$(`[data-s="${next}"]`,root);
      const n=c.cloneNode(true); n.classList.add('in'); n.disabled=true;
      slot.replaceWith(n); c.remove(); next++;
      if(next===N){ ctx.buddy('happy'); ctx.say(st.ok); ctx.done(); }
      else ctx.say(st.items[i].t+' … ¿Y después?');
    } else { c.classList.remove('bad'); void c.offsetWidth; c.classList.add('bad'); ctx.buddy('think'); ctx.say(st.hint); }
  });
};

STN.elegir = (ctx, root) => {
  const st=ctx.st; let answered=false;
  root.innerHTML = `<div class="act"><div class="pcard" style="width:auto;min-width:170px"><span class="em grande">${dib(st.media)}</span></div>
    <div class="answers" style="padding:0">${st.options.map((o,i)=>`<button class="ans" data-i="${i}">${esc(o)}</button>`).join('')}</div></div>`;
  ctx.say(st.intro);
  $$('.ans',root).forEach(b=>b.onclick=()=>{
    if(answered) return;
    if(+b.dataset.i===st.answer){ answered=true; b.classList.add('good'); ctx.buddy('happy'); ctx.say(st.ok); ctx.done(); }
    else { b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad'); ctx.buddy('think'); ctx.say(st.hint); }
  });
};

STN.clasificar = (ctx, root) => {
  const st=ctx.st; let sel=null, placed=0; const N=st.items.length;
  root.innerHTML = `<div class="act"><div class="bins">${st.bins.map(b=>`<div class="bin" data-drop="bin" data-b="${b.id}" role="button" tabindex="0" aria-label="${esc(b.label)}"><h4>${dib(b.em)}${esc(b.label)}</h4></div>`).join('')}</div>
    <div class="chipbox" id="box">${st.items.map((it,i)=>`<button class="pcard drag" data-i="${i}"><span class="em">${dib(it.em)}</span>${esc(it.n)}</button>`).join('')}</div></div>`;
  ctx.say(st.intro);
  const put = (i,binEl) => {
    const chip=$(`#box [data-i="${i}"]`,root); if(!chip) return;
    if(st.items[i].b===binEl.dataset.b){
      chip.classList.remove('sel','drag'); chip.disabled=true; binEl.appendChild(chip); chip.style.transform=''; sel=null; placed++;
      $$('.bin',root).forEach(b=>b.classList.remove('tapready'));
      if(placed===N){ ctx.buddy('happy'); ctx.say(st.ok); ctx.done(); } else ctx.say('¡Bien! Seguí con los otros animales.');
    } else { chip.classList.remove('bad'); void chip.offsetWidth; chip.classList.add('bad'); chip.classList.remove('sel'); sel=null; ctx.buddy('think'); ctx.say(st.hint); }
  };
  $$('#box .pcard',root).forEach(chip=>drag(chip,{
    canDrag:()=>!chip.disabled, accept:t=>t.dataset.drop==='bin',
    onDrop:t=>put(+chip.dataset.i,t),
    onTap:()=>{ $$('#box .pcard',root).forEach(c=>c.classList.remove('sel')); sel=+chip.dataset.i; chip.classList.add('sel'); $$('.bin',root).forEach(b=>b.classList.add('tapready')); ctx.say('¿Adónde va? Tocá el lugar.'); }
  }));
  $$('.bin',root).forEach(b=>{ const go=()=>{ if(sel!==null) put(sel,b); else ctx.say('Primero tocá un animal.'); }; b.onclick=go; b.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } }; });
};

STN.unir = (ctx, root) => {
  const st=ctx.st; let sel=null, ok=0; const N=st.pairs.length;
  const rights=shuffle(st.pairs.map((p,i)=>i));
  root.innerHTML = `<div class="act"><div class="pair"><div class="col" id="cl">${st.pairs.map((p,i)=>`<button class="pcard" data-s="l" data-i="${i}"><span class="em">${dib(p.a)}</span></button>`).join('')}</div>
    <div class="col" id="cr">${rights.map(i=>`<button class="pcard" data-s="r" data-i="${i}"><b style="font-size:1.6rem">${esc(st.pairs[i].b)}</b></button>`).join('')}</div></div></div>`;
  ctx.say(st.intro);
  $$('.pcard',root).forEach(c=>c.onclick=()=>{
    if(c.classList.contains('matched')) return;
    if(state.voz && c.dataset.s==='r') speak(st.pairs[+c.dataset.i].b);
    if(!sel || sel.dataset.s===c.dataset.s){
      $$('.pcard.sel',root).forEach(x=>x.classList.remove('sel')); sel=c; c.classList.add('sel'); return;
    }
    if(sel.dataset.i===c.dataset.i){
      [sel,c].forEach(x=>{ x.classList.remove('sel'); x.classList.add('matched'); }); sel=null; ok++;
      if(ok===N){ ctx.buddy('happy'); ctx.say(st.ok); ctx.done(); } else ctx.say('¡Ese va! Seguí uniendo.');
    } else {
      [sel,c].forEach(x=>{ x.classList.remove('sel','bad'); void x.offsetWidth; x.classList.add('bad'); }); sel=null; ctx.buddy('think'); ctx.say(st.hint);
    }
  });
};

STN.componer = (ctx, root) => {
  const st=ctx.st; let inBoat=st.init, avail=st.cap-st.init+2, answered=false;
  const opts=shuffle(st.opts);
  root.innerHTML = `<div class="act"><span class="lancha-dib">${objeto("lancha")}</span>
    <div class="lancha"><div class="hull" id="hull" data-drop="boat"><div class="seats" id="seats"></div></div></div>
    <div class="dock" id="dock" aria-label="Pasajeros en el muelle"></div>
    <div class="answers" id="q" hidden style="padding:0"><p class="qtxt" style="width:100%;margin:0 0 6px">${esc(st.ask)}</p>${opts.map(o=>`<button class="ans" data-v="${o}">${o}</button>`).join('')}</div>
    <div class="tools"><button class="btn btn-big" id="down">Bajar uno</button></div></div>`;
  function draw(){
    $('#seats',root).innerHTML = Array.from({length:st.cap},(_,i)=>`<div class="seat ${i<inBoat?'in':''}">${i<inBoat?objeto('pasajero'):''}</div>`).join('');
    $('#dock',root).innerHTML = avail>0 ? Array.from({length:avail},()=>`<button class="pax" aria-label="Subir pasajero">${objeto("pasajero")}</button>`).join('') : '<span style="font-family:var(--f-kid);font-weight:800">Muelle vacío</span>';
    $$('#dock .pax',root).forEach(b=>drag(b,{canDrag:()=>!answered&&inBoat<st.cap,accept:t=>t.dataset.drop==='boat',onDrop:up,onTap:up}));
    $('#q',root).hidden = inBoat<st.cap;
    $('#down',root).disabled = answered || inBoat<=st.init;
  }
  function up(){ if(inBoat>=st.cap||answered) return; inBoat++; avail--; draw(); if(inBoat===st.cap) ctx.say(st.ok); }
  $('#down',root).onclick = () => { if(inBoat>st.init && !answered){ inBoat--; avail++; draw(); } };
  $$('.ans',root).forEach(b=>b.onclick=()=>{
    if(answered) return;
    if(+b.dataset.v===st.ans){ answered=true; b.classList.add('good'); ctx.buddy('happy'); ctx.say('¡Eso! Subieron '+st.ans+' pasajeros.'); ctx.done(); draw(); }
    else { b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad'); ctx.buddy('think'); ctx.say(st.hint); }
  });
  ctx.say(st.intro); draw();
};
'use strict';
