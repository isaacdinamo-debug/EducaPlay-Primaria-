'use strict';
/* ======================================================================
   Vistas de las tres zonas
   ======================================================================
   Descubrir (chicos) usa el sistema de Kapi tal cual. Proyectar (docentes)
   y Acompañar (familias) usan la misma base con un acento propio y un
   registro más sobrio. Los números entre paréntesis (P…, D…) remiten al
   documento de arquitectura. */

/* ============ helpers de vista ============ */
const chipArea = (a,g) => `<span class="chip area ${a}"><i aria-hidden="true"></i>${AREAS[a]}${g?` · ${ordinal(g)} grado`:''}</span>`;
const chipDato = (icono, texto) => `<span class="chip dato">${ico(icono)}${texto}</span>`;
const modsOfGrade = g => Object.values(MODS).filter(m=>m.grade===g);
const CUR = { g:null };
const SELLO_DEMO = `<span class="sello-demo">${ico('lapiz')}Contenido de demostración</span>`;
const qs = o => '?'+Object.entries(o).filter(([k,v])=>v).map(([k,v])=>k+'='+encodeURIComponent(v)).join('&');
const li = arr => `<ul>${arr.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const crumbs = list => `<nav class="crumbs" aria-label="Estás en">${list.map((c,i)=>(c[1]?`<a href="${c[1]}">${c[0]}</a>`:`<span aria-current="page">${c[0]}</span>`)+(i<list.length-1?'<span aria-hidden="true">›</span>':'')).join('')}</nav>`;
const SALTO = `<a class="salto" href="#main" data-act="saltar">Saltar al contenido</a>`;

/* Pie institucional. Los logos definitivos todavía no están: van los
   nombres en su lugar, con el mismo orden del membrete. */
const pie = () => `<footer class="pie no-print">
  <div class="pie-in"><div class="pie-inst"><span class="pie-logo">Gobierno de la Provincia de Corrientes</span><span class="pie-logo">Ministerio de Educación</span><span class="pie-logo">Secretaría de Desarrollo Audiovisual</span></div>
  <p>Educaplay Primaria · Versión de trabajo, con contenido de demostración.</p></div></footer>`;

/* ---------- Bienvenida: el paisaje de los Esteros a pantalla completa ---------- */
function vIntro(){
  /* Editorial y sin cajas: el logo oficial, "Primaria" dibujado sobre un
     trazo de pincel, la frase suelta con tres palabras subrayadas, y el
     botón. Todo entra escalonado; tocar la frase la lee en voz alta. */
  /* la puntuación va pegada a la palabra, para que nunca quede sola al principio de un renglón */
  const palabra = (t, n, p='') => `<span class="ip-par"><span class="ip ip${n}">${t}<img src="arte/marca/subrayado-${n}.webp" alt="" aria-hidden="true"></span>${p}</span>`;
  return `<section class="intro">${SALTO}
   ${SIN_MOVIMIENTO?'':`<video class="intro-video" src="arte/esteros.mp4" poster="arte/esteros.webp" autoplay loop muted playsinline aria-hidden="true"></video>`}
   <header class="intro-inst"><span class="pie-logo">Gobierno de la Provincia de Corrientes</span><span class="pie-logo">Ministerio de Educación</span></header>
   <main class="intro-c" id="main" tabindex="-1">
     <h1 class="intro-marca">
       <img class="intro-wm" src="arte/marca/educaplay.webp" alt="Educaplay" width="1200" height="232">
       <span class="intro-prim"><img class="intro-pincel" src="arte/marca/pincel.webp" alt="" aria-hidden="true"><img class="intro-primaria" src="arte/marca/primaria.webp" alt="Primaria"></span>
     </h1>
     <button class="intro-tag" data-act="say" data-text="Un lugar para explorar, aprender y descubrir.">Un lugar para ${palabra('explorar',1,',')} ${palabra('aprender',2)} y ${palabra('descubrir',3,'.')}</button>
     <a class="intro-go" href="#/inicio"><span class="intro-go-ico">${boton('jugar')}</span><span>Comenzar</span></a>
   </main>
   <div class="intro-kapi" aria-hidden="true">${kapiPose('saluda','respira')}</div></section>`;
}

/* ---------- Selección de entrada: Descubrir manda (P40) ---------- */
function vInicio(){
  return `<div class="inicio">${SALTO}<main class="home" id="main" tabindex="-1">
   <a class="home-marca" href="#/" aria-label="Educaplay Primaria, volver a la bienvenida">${marca()}</a>
   <h1>¿Cómo querés entrar hoy?</h1>
   <p class="lead">Un mismo territorio, tres maneras de recorrerlo. Cada espacio tiene su propia mirada, pero los tres están conectados.</p>
   <div class="doors">
    <a class="door descubrir" href="#/descubrir">
      <span class="door-art mesa-kapi" aria-hidden="true">${kapiVivo('saluda')}</span>
      <span class="door-w">${ico('ninos')}Para niñas y niños</span><h2 class="door-t">Descubrir</h2>
      <p class="door-d">Entrá a los mundos de aprendizaje: el núcleo de la experiencia.</p><span class="btn btn-accion btn-big door-go">Entrar</span></a>
    <a class="door proyectar" href="#/proyectar"><span class="door-foto" aria-hidden="true" style="background-image:url(arte/aula.webp)"></span>
      <span class="door-w">${ico('docente')}Para docentes</span><h2 class="door-t">Proyectar</h2>
      <p class="door-d">Mediaciones y recursos para enseñar a partir de cada experiencia.</p><span class="btn btn-zona door-go">Entrar ${ico('flecha')}</span></a>
    <a class="door acompanar" href="#/acompanar"><span class="door-foto" aria-hidden="true" style="background-image:url(arte/galeria.webp)"></span>
      <span class="door-w">${ico('cerca')}Para familias y otros adultos</span><h2 class="door-t">Acompañar</h2>
      <p class="door-d">Recursos para acompañar el aprendizaje.</p><span class="btn btn-zona door-go">Entrar ${ico('flecha')}</span></a>
   </div></main>${pie()}</div>`;
}

/* ---------- Página interna para el equipo (no figura en la navegación) ---------- */
const TOURS = [
  {t:'Recorrido niño',steps:[['Bienvenida','#/'],['Selección de entrada','#/inicio'],['Elegí tu mundo','#/descubrir'],['Mundo de Kapi: el mapa','#/descubrir/1'],['Módulo: Los frutos del monte','#/descubrir/1/modulo/frutos']]},
  {t:'Recorrido docente',steps:[['Proyectar','#/proyectar'],['Guías docentes','#/proyectar/guias'],['1.º grado · Matemática','#/proyectar/guias?g=1&a=mat'],['Ficha del módulo','#/proyectar/modulo/frutos'],['Mapa de Verbos','#/proyectar/aprendizajes'],['Verbo: comparar','#/proyectar/aprendizajes/comparar'],['Qué pasa si…','#/proyectar/que-pasa-si'],['Buscador','#/proyectar/buscar?q=comparaci%C3%B3n%20de%20colecciones']]},
  {t:'Recorrido adulto',steps:[['Acompañar','#/acompanar'],['Conocer Educaplay Primaria','#/acompanar/conocer'],['Estar cerca: Los frutos del monte','#/acompanar/tarjeta/frutos'],['Mapa de Verbos','#/acompanar/aprendizajes'],['Habitar lo digital','#/acompanar/habitar'],['Preguntas que nos hacemos','#/acompanar/preguntas/resolver']]}
];
function vEquipo(){
  return `<main class="home" id="main" tabindex="-1"><a class="home-marca" href="#/inicio">${marca()}</a>
   <h1>Para el equipo</h1><p class="lead">Página interna: no figura en la navegación del sitio. Cada paso lleva directo a esa pantalla.</p>
   <div class="tours">${TOURS.map(t=>`<div class="tour"><h2>${t.t}</h2><ol>${t.steps.map(s=>`<li><a href="${s[1]}">${s[0]}</a></li>`).join('')}</ol></div>`).join('')}</div>
   <div class="fila" style="margin-top:24px"><button class="btn" data-act="reiniciar">${ico('otro')}Reiniciar el avance guardado</button></div></main>`;
}

/* ---------- Barra de Descubrir ----------
   Todo lo que toca un chico mide 64 px o más. */
function kbar(title, back, backLabel){
  const n = state.col.length;
  return `<header class="kbar"><a class="kb-btn" href="${back}">${boton('volver')}<span>${backLabel}</span></a>
   <div class="grow kb-title">${title}</div>
   ${state.me?`<button class="kb-btn kb-yo" data-act="cambiarme" aria-label="Cambiar mi dibujo">${companeroVivo(state.me,'reposo')}</button>`:''}
   ${botonVoz()}
   <button class="kb-btn" data-act="cuaderno" aria-label="Mi cuaderno de campo: ${n} ${n===1?'hallazgo':'hallazgos'}">${boton('cuaderno')}<span>Cuaderno</span><span class="badge ${state.nuevoHallazgo?'salta':''}">${n}</span></button></header>`;
}
const botonVoz = () => `<button class="kb-btn kb-voz ${state.voz?'on':''}" data-act="voz" aria-pressed="${state.voz}" aria-label="Voz que lee en voz alta">${boton('voz')}<span>Voz</span></button>`;

/* ---------- Elegir dibujo: sin cuentas y sin escribir ---------- */
function vElegir(){
  return `${kbar('Descubrir','#/inicio','Inicio')}<main class="pick elegir" id="main" tabindex="-1">
   <div class="titulo-oir"><h1>¿Quién sos hoy?</h1><button class="btn-oir" data-act="say" data-text="¿Quién sos hoy? Tocá un dibujo para tu cuaderno de campo." aria-label="Escuchar">${ico('parlante')}</button></div>
   <p class="sub">Tocá un dibujo para tu cuaderno de campo.</p>
   <div class="comp-grid">${COMPANEROS.map(([k,n,q])=>`<button class="comp" data-act="elegirme" data-me="${k}" aria-label="${n}, ${q}">${companeroVivo(k,'reposo')}<span>${n}</span><small>${q}</small></button>`).join('')}</div></main>`;
}

/* ---------- Elegí tu mundo ---------- */
function vExplorar(){
  if(!state.me) return vElegir();
  const listos = GRADES.filter(g=>WORLDS[g].ready), faltan = GRADES.filter(g=>!WORLDS[g].ready);
  const card = g => {
    const w=WORLDS[g];
    const art = g===1 ? kapiPose('senala') : `<img class="kapi-pose" src="arte/cuerpo/${w.avatar}.webp" alt="" draggable="false">`;
    return `<a class="gcard g${g}" href="#/descubrir/${g}" style="--mapa:url(arte/mapa-${w.id}.webp)"><span class="gfoto" aria-hidden="true"></span><span class="gart" aria-hidden="true">${art}</span><span class="gnum">${ordinal(g)}</span><span class="gname">${w.name}</span><span class="gsub">${w.place}</span><span class="btn btn-accion btn-big gir">Entrar</span></a>`;
  };
  return `${kbar('Descubrir','#/inicio','Inicio')}<main class="pick" id="main" tabindex="-1">
   <div class="titulo-oir"><h1>Elegí tu mundo</h1><button class="btn-oir" data-act="say" data-text="Elegí tu mundo. Cada grado tiene su propio universo, su mapa y sus personajes." aria-label="Escuchar">${ico('parlante')}</button></div>
   <p class="sub">Cada grado tiene su propio universo, su mapa y sus personajes.</p>
   <div class="gradegrid">${listos.map(card).join('')}</div>
   <div class="pronto-fila" aria-label="Mundos que se están preparando"><span class="pronto-t">${ico('niebla')}Se están preparando</span>${faltan.map(g=>`<span class="pronto">${ordinal(g)}</span>`).join('')}</div></main>`;
}

function vSoonWorld(g){
  return `${kbar(ordinal(g)+' grado','#/descubrir','Mundos')}<main class="pick" id="main" tabindex="-1">
   <div class="vacio grande">${ico('niebla')}<h1>Este mundo se está preparando</h1><p>Acá va a haber un mapa, personajes y aventuras nuevas.</p>
   <a class="btn btn-accion btn-big" href="#/descubrir">Elegir otro mundo</a></div></main>`;
}

/* ---------- Mapa del mundo ----------
   Todos los lugares se pueden tocar desde el inicio. La niebla se despeja
   al terminar cada aventura: es recompensa, no candado (P6, P38). */
const isUnlocked = () => true;
function currentNode(w){
  return w.nodes.find(n=>!n.soon && !(n.mod&&state.done[n.mod])) || w.nodes.filter(n=>!n.soon).slice(-1)[0];
}
function nodeStatus(w,n){
  if(n.soon) return 'pronto';
  if(n.mod && state.done[n.mod]) return 'hecho';
  return currentNode(w)===n ? 'actual' : 'niebla';
}
function mapView(w){
  const cur=currentNode(w);
  /* el guía se para a la izquierda del lugar, salvo que esté pegado al borde */
  const tx=cur.x>180?cur.x-108:cur.x+70, ty=cur.y+58;
  const prev=state.avatar[w.id]||{x:tx,y:ty};
  return {
    status:n=>nodeStatus(w,n),
    done:id=>!!state.done[id],
    isNew:id=>!!state.done[id] && !state.seenScenery[w.id+':'+id],
    avatar:{x:tx,y:ty,fromX:prev.x,fromY:prev.y}
  };
}
const ESTADO_TXT = {actual:'Empezá por acá', hecho:'Ya lo jugaste', niebla:'Con niebla', pronto:'Próximamente'};
function vWorld(g){
  const w=WORLDS[g]; if(!w.ready) return vSoonWorld(g);
  CUR.g=g;
  const playable=w.nodes.filter(n=>n.mod), done=playable.filter(n=>state.done[n.mod]).length;
  const senda = w.nodes.map(n=>{ const st=nodeStatus(w,n); return `<li><button class="paso ${st}" data-node="${n.id}"><span class="paso-ico">${glifo(n.icon)}${st==='hecho'?`<span class="paso-tilde">${ico('tilde')}</span>`:''}</span><span class="paso-txt"><b>${n.zone}</b><small>${ESTADO_TXT[st]}</small></span></button></li>`; }).join('');
  return `${kbar(w.name,'#/descubrir','Mundos')}<main class="mapscreen" id="main" tabindex="-1">
   <div class="mapwrap"><div class="map" id="map">${mapSVG(w,mapView(w))}<ol class="senda" aria-label="Lugares de ${w.name}">${senda}</ol></div></div>
   <div class="mapfoot"><button class="btn-oir" data-act="say" data-text="${esc(w.mission)}" aria-label="Escuchar la misión">${ico('parlante')}</button>
    <p class="mission">${w.mission}</p>
    <div class="riel" role="progressbar" aria-label="Aventuras completadas" aria-valuemin="0" aria-valuemax="${playable.length}" aria-valuenow="${done}" aria-valuetext="${done} de ${playable.length}">${playable.map((n,i)=>`<i class="${i<done?'ok':''}">${ico('huella')}</i>`).join('')}</div></div></main>`;
}
function mountMap(g){
  const w=WORLDS[g], view=mapView(w);
  const av=$('#avatar');
  if(av){ requestAnimationFrame(()=>requestAnimationFrame(()=>{ av.style.transform=`translate(${view.avatar.x}px,${view.avatar.y}px)`; })); }
  state.avatar[w.id]={x:view.avatar.x,y:view.avatar.y};
  w.nodes.forEach(n=>{ if(n.mod && state.done[n.mod]) state.seenScenery[w.id+':'+n.mod]=true; });
}
function openPop(id){
  const w=WORLDS[CUR.g]; if(!w) return;
  const n=w.nodes.find(x=>x.id===id); if(!n) return;
  closePop();
  const st=nodeStatus(w,n), m=n.mod?MODS[n.mod]:null;
  let inner;
  if(st==='pronto'){
    inner=`<div class="pop-ico">${glifo(n.icon)}</div><h3>${n.title}</h3><p>${n.blurb} Volvé pronto: acá va a haber una nueva aventura.</p><div class="pop-btns"><button class="btn btn-big" data-act="popclose">Entendido</button></div>`;
  } else {
    inner=`${n.guia?`<div class="pop-guia" title="${PERSONAJES_1[n.guia]}">${companeroVivo(n.guia,'reposo')}</div>`:''}<div class="pop-ico">${glifo(m.icon)}</div><h3>${m.title}</h3><p>${m.blurb}</p>
      <div class="pop-btns"><a class="btn btn-accion btn-big" href="#/descubrir/${m.grade}/modulo/${m.id}">${ico('jugar')}${st==='hecho'?'Jugar otra vez':'Entrar'}</a><button class="btn-oir" data-act="say" data-text="${esc(m.title+'. '+m.blurb)}" aria-label="Escuchar">${ico('parlante')}</button></div>`;
  }
  const el=document.createElement('div');
  el.className='pop'; el.id='pop'; el.setAttribute('role','dialog'); el.setAttribute('aria-label',n.title||m.title);
  el.dataset.side = n.y>270 ? 'above' : 'below';
  el.style.left = Math.max(19, Math.min(81, n.x/10))+'%'; el.style.top = (n.y/6.4)+'%';
  el.innerHTML = `<button class="pop-x" data-act="popclose" aria-label="Cerrar">${boton('cerrar')}</button>${inner}`;
  $('#map').appendChild(el);
  gestoCompanero($('.pop-guia video',el),'saluda');
  const focusEl=$('a.btn,button.btn',el); if(focusEl) focusEl.focus({preventScroll:true});
}
function closePop(){ const p=$('#pop'); if(p) p.remove(); }

/* ---------- Módulo ----------
   "Mapa" vuelve al mapa: no hay cruz, porque volver no es salir. */
/* Tataendy, el guacamayo, acompaña en vivo; Kapi usa sus poses. */
const BUDDY = { guaca:companeroVivo('guacamayo','reposo'), kapi:kapiPose('reposo'), yaca:companeroVivo('ita','reposo') };
function vModule(g,id){
  const m=MODS[id];
  return `<div class="kmod"><header class="kbar"><a class="kb-btn" href="#/descubrir/${g}" aria-label="Volver al mapa">${boton('mapa')}<span>Mapa</span></a>
    <div class="grow kb-title">${glifo(m.icon)}<span>${m.title}</span></div>
    <div class="riel" id="dots" aria-label="Actividades de esta aventura">${m.stations.map(()=>`<i>${ico('huella')}</i>`).join('')}</div>
    ${botonVoz()}
    <button class="kb-btn" data-act="share" aria-label="Llevar esta misión a casa">${boton('casa')}<span>Para casa</span></button></header>
   <main class="stage ${m.scene==='rio'?'riverside':''}" id="stage-wrap"><div id="stage"></div><button class="buddy" id="buddy" data-act="ayuda" aria-label="Tocá a tu compañero para escuchar la consigna o pedir una pista">${BUDDY[m.buddy]}<span class="buddy-globo" aria-hidden="true">${ico('chat')}</span></button></main>
   <footer class="narr"><button class="btn-oir" data-act="speak" aria-label="Escuchar la consigna">${ico('parlante')}</button><p class="narr-t" id="narr-t" aria-live="polite"></p><button class="btn btn-accion btn-big" id="next" hidden></button></footer></div>`;
}

/* =========================================================
   Barra de Proyectar y de Acompañar: misma estructura, otro acento
   ========================================================= */
function searchForm(q){
  return `<form class="psearch" data-form="search" role="search"><label class="sr" for="sq">Buscar contenido o concepto</label><span class="psearch-ico">${ico('buscar')}</span><input id="sq" name="q" type="search" placeholder="Buscar contenido o concepto" value="${esc(q||'')}" autocomplete="off"><button class="btn btn-zona btn-sm" type="submit">Buscar</button></form>`;
}
function topnav(zone,q){
  const tabs=[['descubrir','Descubrir'],['proyectar','Proyectar'],['acompanar','Acompañar']];
  return `${SALTO}<header class="znav no-print"><a class="znav-marca" href="#/inicio" aria-label="Educaplay Primaria, ir a la selección de entrada">${marca()}</a>
   <span class="znav-zona">${zone==='proyectar'?'Para docentes':'Para familias y otros adultos'}</span>
   ${zone==='proyectar'?searchForm(q):''}
   <nav class="ztabs" aria-label="Espacios de Educaplay Primaria">${tabs.map(([k,l])=>`<a href="#/${k}" ${k===zone?'aria-current="page"':''}>${l}</a>`).join('')}</nav></header>`;
}
const membrete = titulo => `<div class="membrete solo-print"><b>Gobierno de la Provincia de Corrientes · Ministerio de Educación</b><span>Educaplay Primaria · ${titulo}</span></div>`;

/* =========================================================
   PROYECTAR
   ========================================================= */
function vProyectarHub(){
  const nMods=Object.keys(MODS).length;
  const cards=[
    {href:'#/proyectar/guias', ic:'guias', t:'Guías docentes', d:'Encontrá una experiencia por grado, área, eje y contenido. Incluye las propuestas sin pantallas, los recursos para el aula y las ideas para el cuaderno.'},
    {href:'#/proyectar/aprendizajes', ic:'aprendizajes', t:'Aprendizajes en acción', d:'El Mapa de Verbos: qué hace cada chico o chica en cada experiencia, qué puede empezar a comprender y con qué contenido se relaciona.'},
    {href:'#/proyectar/que-pasa-si', ic:'quepasa', t:'Qué pasa si…', d:'Respuestas a las dudas más frecuentes sobre el uso en el aula.'}
  ];
  return `${topnav('proyectar')}<main class="pmain" id="main" tabindex="-1">
   <header class="zhero con-arte" style="--arte:url(arte/aula.webp)"><h1>Mediaciones y recursos para enseñar</h1>
   <p>Una experiencia lúdica digital adquiere nuevos sentidos cuando se recupera, se contextualiza y se pone en diálogo con las prácticas de enseñanza. Elegí por dónde empezar.</p></header>
   <div class="cards3">${cards.map(c=>`<a class="tcard con-dib" href="${c.href}">${seccion(c.ic)}<h2>${c.t}</h2><p>${c.d}</p><span class="tcard-ir">Entrar ${ico('flecha')}</span></a>`).join('')}</div>
   <p class="rescount">${nMods} experiencias con ficha docente cargada.</p></main>${pie()}`;
}

/* Guías docentes integra Sin pantallas, Recursos para el aula y Para el
   cuaderno (D2, D3): son pestañas de una misma sección. */
const GUIAS_TABS=[['guias','Por contenido'],['sin-pantallas','Sin pantallas'],['recursos','Recursos para el aula'],['cuaderno','Para el cuaderno']];
const guiasNav = cur => `<nav class="subtabs no-print" aria-label="Secciones de Guías docentes">${GUIAS_TABS.map(([k,l])=>`<a href="#/proyectar/${k}" ${k===cur?'aria-current="page"':''}>${l}</a>`).join('')}</nav>`;

function mcard(id){
  const m=MODS[id];
  return `<article class="mc"><div class="ic" aria-hidden="true">${glifo(m.icon)}</div><div><h3>${m.title}</h3><p>${m.blurb}</p>
    <div class="meta">${chipArea(m.area,m.grade)}${chipDato('huella',m.stations.length+' actividades')}${chipDato('reloj',m.duration)}</div></div>
    <div class="acts"><a class="btn btn-sm btn-zona" href="#/proyectar/modulo/${id}">${ico('ficha')}Ficha docente</a><a class="enlace" href="#/descubrir/${m.grade}/modulo/${id}">Ver el módulo</a></div></article>`;
}
function vGuias(q){
  const g=+q.g||0, a=q.a||'', e=q.e||'', c=q.c||'';
  const data = g ? CURR[g] : null;
  const seg = (items, cur, mk) => `<div class="seg">${items.map(i=>i.off?`<span title="Próximamente">${i.t}</span>`:`<a href="#/proyectar/guias${mk(i)}" ${String(i.v)===String(cur)?'aria-current="true"':''}>${i.t}</a>`).join('')}</div>`;
  /* Los grados sin contenido se ven, pero no se pueden elegir (P14). */
  let filters = `<div class="fgroup"><h3><em>1</em> Grado</h3>${seg(GRADES.map(x=>({v:x,t:ordinal(x),off:!CURR[x]})),g,i=>qs({g:i.v}))}<small class="ayuda">3.º a 6.º: próximamente.</small></div>`;
  let right='', trail=[['Proyectar','#/proyectar'],['Guías docentes','#/proyectar/guias']];
  if(!g || !data){
    right = `<div class="vacio"><h2>Empezá eligiendo un grado</h2><p>Después vas a poder elegir área, eje y contenido. También podés buscar un concepto, por ejemplo:</p>
      <div class="seg">${['comparación de colecciones','correspondencia','carta','clasificar animales','precios'].map(t=>`<a href="#/proyectar/buscar?q=${encodeURIComponent(t)}">${t}</a>`).join('')}</div></div>`;
  } else {
    trail.push([ordinal(g)+' grado', '#/proyectar/guias'+qs({g})]);
    const areaKeys=Object.keys(data);
    filters += `<div class="fgroup"><h3><em>2</em> Área</h3>${seg(areaKeys.map(k=>({v:k,t:AREAS[k]})),a,i=>qs({g,a:i.v}))}</div>`;
    let ejes=[], eje=null, cont=null;
    if(a && data[a]){
      trail.push([AREAS[a], '#/proyectar/guias'+qs({g,a})]);
      ejes=data[a].eje; eje=ejes.find(x=>x.id===e);
      filters += `<div class="fgroup"><h3><em>3</em> Eje</h3><div class="flist">${ejes.map(x=>`<a href="#/proyectar/guias${qs({g,a,e:x.id})}" ${x.id===e?'aria-current="true"':''}>${x.name}</a>`).join('')}</div></div>`;
      if(eje){
        trail.push([eje.name, '#/proyectar/guias'+qs({g,a,e})]);
        cont=eje.cont.find(x=>x.id===c);
        filters += `<div class="fgroup"><h3><em>4</em> Contenido</h3><div class="flist">${eje.cont.map(x=>`<a href="#/proyectar/guias${qs({g,a,e,c:x.id})}" ${x.id===c?'aria-current="true"':''}>${x.name}</a>`).join('')}</div></div>`;
        if(cont) trail.push([cont.name,null]);
      }
    }
    let ids=[];
    if(cont) ids=cont.mods; else if(eje) eje.cont.forEach(x=>x.mods.forEach(i=>ids.push(i))); else if(a&&data[a]) data[a].eje.forEach(x=>x.cont.forEach(y=>y.mods.forEach(i=>ids.push(i)))); else areaKeys.forEach(k=>data[k].eje.forEach(x=>x.cont.forEach(y=>y.mods.forEach(i=>ids.push(i)))));
    ids=[...new Set(ids)];
    const areasHTML = !a ? `<h2 class="h2">Áreas de ${ordinal(g)} grado</h2><div class="areas">${areaKeys.map(k=>{ const n=new Set(); data[k].eje.forEach(x=>x.cont.forEach(y=>y.mods.forEach(i=>n.add(i)))); return `<a class="acard area ${k}" href="#/proyectar/guias${qs({g,a:k})}"><i aria-hidden="true"></i><b>${AREAS[k]}</b><span>${n.size} ${n.size===1?'módulo':'módulos'}</span></a>`; }).join('')}</div>` : '';
    right = `${areasHTML}<h2 class="h2">Módulos</h2><p class="rescount">${ids.length} ${ids.length===1?'módulo':'módulos'}${cont?' para este contenido':''}</p>
      <div class="mcards">${ids.length?ids.map(mcard).join(''):`<div class="vacio"><p>Este contenido todavía no tiene módulos. Cuando se carguen van a aparecer acá, con su ficha y su propuesta para las familias.</p></div>`}</div>`;
  }
  return `${topnav('proyectar')}<main class="pmain" id="main" tabindex="-1">${crumbs(trail)}<h1 class="ph1 con-dib">${seccion('guias')}${g&&data?`Contenidos y módulos de ${ordinal(g)} grado`:'Guías docentes'}</h1>
    <p class="bajada">Encontrá lo que necesitás para enseñar.</p>${guiasNav('guias')}
    <div class="pgrid"><aside class="filters" aria-label="Filtros"><p class="ayuda">Elegí de a un paso, o escribí un concepto en el buscador de la barra superior.</p>${filters}</aside><section aria-live="polite">${right}</section></div></main>${pie()}`;
}

function search(qq){
  const toks=norm(qq).split(/\s+/).filter(t=>t.length>=3); if(!toks.length) return [];
  return Object.values(MODS).map(m=>{
    const strong=norm([m.title,m.kw,m.cont.join(' '),m.activity,AREAS[m.area]].join(' '));
    const hay=norm(JSON.stringify(m.sheet)+' '+strong);
    let s=0; toks.forEach(t=>{ if(strong.includes(t)) s+=3; else if(hay.includes(t)) s+=1; });
    if(strong.includes(norm(qq).trim())) s+=6;
    return {m,s};
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).filter((x,i,arr)=>x.s>=arr[0].s*0.3).map(x=>x.m);
}
function vSearch(q){
  const qq=q.q||''; const res=search(qq);
  const sugerencias = lista => `<div class="seg">${lista.map(t=>`<a href="#/proyectar/buscar?q=${encodeURIComponent(t)}">${t}</a>`).join('')}</div>`;
  const body = !qq.trim() ? `<div class="vacio"><p>Escribí un concepto o contenido, por ejemplo “correspondencia” o “carta”, y presioná Buscar.</p></div>`
   : !res.length ? `<div class="vacio"><h2>No encontramos resultados para “${esc(qq)}”</h2><p>Probá con una palabra más general o con alguna de estas búsquedas:</p>${sugerencias(['comparación de colecciones','conteo','clasificar','lectura','precios'])}</div>`
   : res.map(m=>{ const s=m.sheet; return `<article class="mc"><div class="ic" aria-hidden="true">${glifo(m.icon)}</div><div>
      <h3>${m.title}</h3><p><b>Actividad:</b> ${m.activity}</p>
      <div class="meta">${chipArea(m.area,m.grade)}<span class="chip dato">Contenido: ${m.cont[0]}</span></div></div>
      <div class="acts"><a class="btn btn-sm btn-zona" href="#/proyectar/modulo/${m.id}">${ico('ficha')}Ficha docente</a><a class="enlace" href="#/descubrir/${m.grade}/modulo/${m.id}">Ver el módulo</a></div>
      <details class="res-det"><summary>Ver orientaciones</summary><dl class="dl">
       <dt>Propósito</dt><dd>${s.proposito}</dd><dt>Aprendizaje</dt><dd>${li(s.aprendizajes)}</dd><dt>Contenido</dt><dd>${li(m.cont)}</dd>
       <dt>Procedimientos esperables</dt><dd>${li(s.esperables)}</dd><dt>Estrategias</dt><dd>${li(s.estrategias)}</dd>
       <dt>Errores frecuentes</dt><dd>${li(s.errores.map(x=>x.e))}</dd><dt>Variables didácticas</dt><dd>${li(s.variables.map(x=>`<b>${x.v}:</b> ${x.d}`))}</dd>
       <dt>Anticipaciones</dt><dd>${li(s.anticipaciones)}</dd><dt>Orientaciones</dt><dd>${li(s.intervenciones)}</dd></dl></details></article>`; }).join('');
  return `${topnav('proyectar',qq)}<main class="pmain" id="main" tabindex="-1">${crumbs([['Proyectar','#/proyectar'],['Búsqueda',null]])}<h1 class="ph1">${qq.trim()?`Resultados para “${esc(qq)}”`:'Buscador por contenido o concepto'}</h1>
   <p class="rescount">${qq.trim()?`${res.length} ${res.length===1?'resultado':'resultados'}`:''}</p><div class="mcards results">${body}</div></main>${pie()}`;
}

function listaGuias(cur, titulo, bajada, fila){
  return `${topnav('proyectar')}<main class="pmain" id="main" tabindex="-1">${crumbs([['Proyectar','#/proyectar'],['Guías docentes','#/proyectar/guias'],[titulo,null]])}
   <h1 class="ph1 con-dib">${seccion(cur==='sin-pantallas'?'sinpantallas':'guias')}Guías docentes</h1><p class="bajada">${bajada}</p>${guiasNav(cur)}
   <div class="mcards">${Object.values(MODS).map(fila).join('')}</div></main>${pie()}`;
}
function vSinPantallasList(){
  return listaGuias('sin-pantallas','Sin pantallas','Lo digital no es el final de la experiencia. Cada propuesta retoma un módulo y lo continúa con objetos, conversación o movimiento.',
   m=>`<article class="mc"><div class="ic" aria-hidden="true">${glifo(m.icon)}</div><div><h3>${m.card.consigna.split('.')[0]}.</h3>
    <div class="meta">${chipArea(m.area,m.grade)}<span class="chip dato">Retoma: ${m.title}</span>${chipDato('reloj',m.card.tiempo)}${chipDato('materiales',m.card.materiales)}</div></div>
    <div class="acts"><a class="btn btn-sm btn-zona" href="#/proyectar/sin-pantallas/${m.id}">Ver propuesta</a></div></article>`);
}
function vSinPantallasItem(id){
  const m=MODS[id]; if(!m) return null; const c=m.card;
  return `${topnav('proyectar')}<main class="pmain" id="main" tabindex="-1">${crumbs([['Proyectar','#/proyectar'],['Guías docentes','#/proyectar/guias'],['Sin pantallas','#/proyectar/sin-pantallas'],[m.title,null]])}
   <div class="sheethead"><div><h1 class="ph1">${c.consigna.split('.')[0]}.</h1><div class="meta">${chipArea(m.area,m.grade)}<span class="chip dato">Retoma: ${m.title}</span></div></div>
    <a class="btn btn-zona" href="#/proyectar/modulo/${m.id}?tab=profundizar">${ico('ficha')}Ver en la ficha docente</a></div>
   <div class="panel"><div class="twocol"><div><h3>Consigna</h3><p>${c.consigna}</p><h3>Materiales</h3><p>${c.materiales}</p><h3>Tiempo aproximado</h3><p>${c.tiempo}</p></div>
    <div><h3>Para conversar</h3>${li(c.preguntas)}<h3>Para quien coordina</h3><p>${c.orientacion}</p></div></div></div>
   <div class="linkcard puente"><span class="linkcard-ico">${ico('cerca')}</span><div><b>También está disponible para las familias</b><p>La misma propuesta, en el lenguaje de Acompañar.</p></div><a class="btn" href="#/acompanar/tarjeta/${m.id}">Ver en Estar cerca</a></div></main>${pie()}`;
}
function vRecursosAula(){
  return listaGuias('recursos','Recursos para el aula','Imprimibles, modo aula y materiales de apoyo, organizados por módulo.',
   m=>`<article class="mc"><div class="ic" aria-hidden="true">${glifo(m.icon)}</div><div><h3>${m.title}</h3><p>${m.sheet.recursos[0]}</p><div class="meta">${chipArea(m.area,m.grade)}</div></div>
    <div class="acts"><a class="btn btn-sm btn-zona" href="#/proyectar/modulo/${m.id}?tab=recursos">Ver recursos</a></div></article>`);
}
function vCuadernoList(){
  return listaGuias('cuaderno','Para el cuaderno','Propuestas para trabajar en el cuaderno de clase a partir de cada módulo.',
   m=>`<article class="mc"><div class="ic" aria-hidden="true">${glifo(m.icon)}</div><div><h3>${m.title}</h3><p class="pendiente">Propuesta para el cuaderno: a completar por el equipo de contenidos.</p><div class="meta">${chipArea(m.area,m.grade)}</div></div>
    <div class="acts"><a class="btn btn-sm btn-zona" href="#/proyectar/modulo/${m.id}?tab=cuaderno">Ver en la ficha</a></div></article>`);
}

/* ---------- Ficha del módulo: Antes, Durante, Después (P47) ----------
   Las doce pestañas del prototipo se agrupan en tres momentos. Las
   claves viejas (?tab=accion, ?tab=recursos…) siguen funcionando: abren
   el momento que las contiene y bajan hasta el bloque. */
const FICHA = [
  ['antes','Antes','Para preparar la clase',[['propuesta','La propuesta'],['curriculo','Currículo'],['aprendizajes','Aprendizajes esperados'],['accion','Aprendizajes en acción']]],
  ['durante','Durante','Mientras juegan',[['actividades','Actividades del módulo'],['procedimientos','Procedimientos'],['errores','Errores frecuentes'],['variables','Variables didácticas'],['intervenciones','Intervenciones']]],
  ['despues','Después','Para retomar y seguir',[['profundizar','Profundizar'],['sinpantallas','Sin pantallas'],['cuaderno','Para el cuaderno'],['recursos','Recursos para el aula'],['acompanar','Para las familias']]]
];
const momentoDe = k => (FICHA.find(f=>f[0]===k) || FICHA.find(f=>f[3].some(s=>s[0]===k)) || FICHA[0])[0];
const verboLink = (zone, v) => `<a class="chip verbo" href="#/${zone}/aprendizajes/${encodeURIComponent(norm(v))}">${v}</a>`;
function sheetPanel(k,m){
  const s=m.sheet, c=m.card;
  switch(k){
    case 'propuesta': return `<h3>Propósito</h3><p>${s.proposito}</p><h3>Situación de enseñanza</h3><p>${s.situacion}</p><h3>Organización</h3><p>${m.stations.length} actividades · duración aproximada ${m.duration} · trabajo individual o en parejas.</p>`;
    case 'curriculo': return `<dl class="dl"><dt>Grado</dt><dd>${ordinal(m.grade)} grado</dd><dt>Área</dt><dd>${AREAS[m.area]}</dd><dt>Eje</dt><dd>${m.eje}</dd><dt>Contenidos</dt><dd>${li(m.cont)}</dd><dt>Referencia</dt><dd>${s.curriculo.ref}</dd></dl><p class="note">${s.curriculo.nota}</p>`;
    case 'aprendizajes': return `<div class="twocol"><div><h3>Aprendizajes esperados</h3>${li(s.aprendizajes)}</div><div><h3>Conocimientos previos</h3>${li(s.previos)}</div></div>`;
    case 'accion': return `<p>Los verbos de este módulo, según el Mapa de Verbos. Tocá uno para ver en qué otros módulos se ejercita.</p>
      <div class="stlist">${(m.apr||[]).map(a=>`<div class="verbo-ficha"><div class="fila">${verboLink('proyectar',a.verbo)}${a.otro?`<span class="chip dato">otro verbo posible: ${a.otro}</span>`:''}</div>
        <dl class="dl"><dt>¿Qué hace el niño o la niña?</dt><dd>${a.hace}</dd><dt>¿Qué puede empezar a comprender, construir o hacer?</dt><dd>${a.comprende}</dd><dt>Referencia curricular</dt><dd>${a.curricular}</dd></dl></div>`).join('')}</div>`;
    case 'actividades': return `<div class="stlist">${m.stations.map((st,i)=>`<div class="stitem"><div><b>${st.title}</b><p>${st.aim}</p></div><a class="btn btn-sm" href="#/descubrir/${m.grade}/modulo/${m.id}?est=${i}">${ico('jugar')}Probar</a></div>`).join('')}</div>`;
    case 'procedimientos': return `<div class="twocol"><div><h3>Procedimientos esperables</h3>${li(s.esperables)}</div><div><h3>Procedimientos posibles</h3>${li(s.posibles)}</div></div><h3>Estrategias</h3>${li(s.estrategias)}<h3>Anticipaciones</h3>${li(s.anticipaciones)}`;
    case 'errores': return s.errores.map(x=>`<div class="errbox"><b>${x.e}</b><span class="q">Qué hacer: ${x.q}</span></div>`).join('');
    case 'variables': return `<table class="vtable"><tbody>${s.variables.map(x=>`<tr><th scope="row">${x.v}</th><td>${x.d}</td></tr>`).join('')}</tbody></table>`;
    case 'intervenciones': return `<h3>Preguntas y orientaciones para el docente</h3>${li(s.intervenciones)}`;
    case 'profundizar': return `<p>Propuestas para volver sobre la experiencia, plantear nuevos desafíos y ponerla en diálogo con la enseñanza.</p>
      <div class="twocol"><div><h3>Nuevos desafíos</h3>${li(m.prof?.desafios||['A completar por el equipo docente.'])}</div><div><h3>Para conversar y recuperar</h3>${li(m.prof?.conversar||['A completar por el equipo docente.'])}</div></div>
      <h3>Para crear nuevas situaciones</h3>${li(m.prof?.crear||['A completar por el equipo docente.'])}`;
    case 'sinpantallas': return `<p>La misma experiencia, con materiales concretos.</p><p class="consigna">${c.consigna}</p><div class="meta">${chipDato('reloj',c.tiempo)}${chipDato('materiales',c.materiales)}</div><p><a class="enlace" href="#/proyectar/sin-pantallas/${m.id}">Ver la propuesta completa</a></p>`;
    case 'cuaderno': return `<p class="pendiente">Propuesta para trabajar en el cuaderno de clase a partir de este módulo: a completar por el equipo de contenidos.</p>`;
    case 'recursos': return `${li(s.recursos)}<div class="fila no-print"><button class="btn btn-sm" data-act="toast" data-msg="Demostración: acá se abriría el modo aula a pantalla completa.">${ico('pantalla')}Modo aula</button><button class="btn btn-sm" data-act="toast" data-msg="Demostración: acá se descargarían los imprimibles.">${ico('imprimir')}Imprimibles</button></div>`;
    case 'acompanar': return `<div class="linkcard puente"><span class="linkcard-ico">${ico('cerca')}</span><div><b>Para hacer juntos en casa</b><p>${c.consigna}</p><div class="meta">${chipDato('reloj',c.tiempo)}${chipDato('personas',c.con)}</div></div><a class="btn" href="#/acompanar/tarjeta/${m.id}">Abrir en Acompañar</a></div><p class="note">La propuesta es opcional. Se puede retomar en el aula pidiendo que cuenten cómo lo resolvieron, sin calificar. Para hacerla llegar a las familias, se puede imprimir desde Acompañar.</p>`;
  }
}
function vSheet(id,tab){
  const m=MODS[id]; const t=momentoDe(tab);
  return `${topnav('proyectar')}<main class="pmain ficha" id="main" tabindex="-1">${membrete('Guía docente')}${crumbs([['Proyectar','#/proyectar'],['Guías docentes','#/proyectar/guias'],[ordinal(m.grade)+' grado','#/proyectar/guias'+qs({g:m.grade})],[AREAS[m.area],'#/proyectar/guias'+qs({g:m.grade,a:m.area})],[m.title,null]])}
   <div class="sheethead"><span class="sheet-ico" aria-hidden="true">${glifo(m.icon)}</span><div class="grow"><h1 class="ph1">${m.title}</h1><div class="meta">${chipArea(m.area,m.grade)}<span class="chip dato">${m.eje}</span>${chipDato('reloj',m.duration)}${SELLO_DEMO}</div></div>
    <div class="sheet-acts no-print"><button class="btn btn-zona" data-act="print">${ico('descargar')}Guía en PDF</button><a class="btn" href="#/descubrir/${m.grade}/modulo/${m.id}">${ico('jugar')}Ver el módulo</a></div></div>
   <div class="tablist no-print" role="tablist" aria-label="Momentos de la clase">${FICHA.map(([k,l,sub])=>`<button role="tab" id="tab-${k}" aria-controls="p-${k}" aria-selected="${k===t}" tabindex="${k===t?0:-1}" data-act="tab" data-tab="${k}"><b>${l}</b><small>${sub}</small></button>`).join('')}</div>
   ${FICHA.map(([k,l,sub,secs])=>`<div class="tpanel" role="tabpanel" id="p-${k}" aria-labelledby="tab-${k}" ${k===t?'':'hidden'}><h2 class="solo-print momento">${l} · ${sub}</h2>
     ${secs.map(([sk,sl])=>`<section class="fsec" id="s-${sk}"><h2>${sl}</h2>${sheetPanel(sk,m)}</section>`).join('')}</div>`).join('')}</main>${pie()}`;
}

/* ---------- Qué pasa si… (D4): FAQ docente, con respuestas de demostración ---------- */
const QUE_PASA = [
  ['…no hay conexión en el aula?','Un módulo que ya se abrió se puede terminar sin internet. Conviene abrirlo antes de la clase. Mientras tanto, la propuesta sin pantallas de cada ficha permite trabajar el mismo contenido con materiales concretos.'],
  ['…hay pocos dispositivos?','Las actividades admiten el trabajo en parejas o en pequeños grupos alrededor de una misma pantalla. La pestaña Durante de cada ficha sugiere cómo organizar los turnos.'],
  ['…alguien termina mucho antes que el resto?','Puede volver a jugar la aventura. En Después, cada ficha propone nuevos desafíos para seguir.'],
  ['…alguien no llega a terminar?','No hace falta terminar en una sola clase. El avance queda guardado en el dispositivo y se puede retomar desde el mapa.'],
  ['…todavía no leen por su cuenta?','Todas las consignas se pueden escuchar: el botón de voz lee en voz alta cada pantalla y se puede activar o apagar en cualquier momento.'],
  ['…quiero que la familia participe?','Cada módulo tiene una idea breve para hacer en casa. Está en Después, dentro de la ficha, y se puede imprimir desde Acompañar.']
];
function vQuePasaSi(){
  return `${topnav('proyectar')}<main class="pmain" id="main" tabindex="-1">${crumbs([['Proyectar','#/proyectar'],['Qué pasa si…',null]])}
   <h1 class="ph1 con-dib">${seccion('quepasa')}Qué pasa si…</h1><p class="bajada">Dudas frecuentes sobre el uso en el aula. ${SELLO_DEMO}</p>
   <div class="faq">${QUE_PASA.map(([q,a])=>`<details><summary>¿Qué pasa si ${q.slice(1)}</summary><p>${a}</p></details>`).join('')}</div></main>${pie()}`;
}

/* =========================================================
   Aprendizajes en acción: el Mapa de Verbos (D5, D6)
   Un solo componente con dos vistas. La docente muestra la referencia
   curricular; la de familias, no. Se entra por un verbo y se llega a los
   módulos que lo ejercitan; desde cada módulo se vuelve a sus verbos.
   ========================================================= */
const modsDeVerbo = v => Object.values(MODS).flatMap(m=>(m.apr||[]).filter(a=>norm(a.verbo)===norm(v)).map(a=>({...a,m})));
function vVerbos(zone, verbo){
  const doc = zone==='proyectar';
  const base = [[doc?'Proyectar':'Acompañar','#/'+zone],['Aprendizajes en acción', verbo?`#/${zone}/aprendizajes`:null]];
  const main = doc ? 'pmain' : 'amain';
  if(verbo){
    const fichas = modsDeVerbo(verbo), fam = VERB_FAMILIES.find(f=>f.verbs.some(v=>norm(v)===norm(verbo)));
    const nombre = fam ? fam.verbs.find(v=>norm(v)===norm(verbo)) : verbo;
    return `${topnav(zone)}<main class="${main}" id="main" tabindex="-1">${crumbs([...base,[nombre,null]])}
     <header class="zhero verbo-hero ${fam?fam.id:''}"><span class="chip dato">${fam?fam.name:'Verbo'}</span><h1>${nombre}</h1>
      <p>${fichas.length?`${fichas.length} ${fichas.length===1?'módulo lo pone':'módulos lo ponen'} en juego.`:'Todavía no hay módulos cargados para este verbo.'}</p></header>
     <div class="mcards">${fichas.map(a=>`<article class="mc verbo-mod"><div class="ic" aria-hidden="true">${glifo(a.m.icon)}</div><div><h2>${a.m.title}</h2><div class="meta">${chipArea(a.m.area,a.m.grade)}</div>
       <dl class="dl"><dt>¿Qué hace el niño o la niña?</dt><dd>${a.hace}</dd><dt>¿Qué puede empezar a comprender?</dt><dd>${a.comprende}</dd>${doc?`<dt>Referencia curricular</dt><dd>${a.curricular}</dd>`:''}</dl>
       <div class="fila"><span class="ayuda">Otros verbos de este módulo:</span>${(a.m.apr||[]).filter(x=>norm(x.verbo)!==norm(verbo)).map(x=>verboLink(zone,x.verbo)).join('')||'<span class="ayuda">ninguno cargado.</span>'}</div></div>
       <div class="acts">${doc?`<a class="btn btn-sm btn-zona" href="#/proyectar/modulo/${a.m.id}?tab=accion">${ico('ficha')}Ver la ficha</a>`:`<a class="btn btn-sm btn-zona" href="#/acompanar/tarjeta/${a.m.id}">Idea para estar cerca</a>`}</div></article>`).join('')}</div>
     <p><a class="enlace" href="#/${zone}/aprendizajes">${ico('volver')}Volver al Mapa de Verbos</a></p></main>${pie()}`;
  }
  const familia = f => `<section class="fam ${f.id}"><h2><img class="fam-ico" src="arte/verbos/${f.id}.webp" alt="">${f.name}</h2><div class="fila">${f.verbs.map(v=>{ const n=modsDeVerbo(v).length; return n ? `<a class="chip verbo" href="#/${zone}/aprendizajes/${encodeURIComponent(norm(v))}">${v}<b>${n}</b></a>` : `<span class="chip verbo vacio" title="Sin módulos todavía">${v}</span>`; }).join('')}</div></section>`;
  return `${topnav(zone)}<main class="${main}" id="main" tabindex="-1">${crumbs(base)}
   <header class="zhero">${seccion('aprendizajes','zhero-dib')}<h1>Aprendizajes en acción</h1><p>${doc?'El verbo es una etiqueta breve y reutilizable; la explicación la contextualiza en cada experiencia.':'Mientras juegan, exploran, conversan o resuelven, chicos y chicas ponen en acción conocimientos, habilidades y maneras de pensar.'}</p></header>
   <p class="ayuda">Tocá un verbo para ver los módulos que lo ejercitan. El número indica cuántos hay; los verbos en gris todavía no tienen módulos.</p>
   <div class="verbos">${VERB_FAMILIES.map(familia).join('')}</div></main>${pie()}`;
}

/* =========================================================
   ACOMPAÑAR
   ========================================================= */
const ahero = (icono, titulo, bajada, arte) => `<header class="zhero ${arte?'con-arte':''}" ${arte?`style="--arte:url(${arte})"`:''}>${icono?seccion(icono,'zhero-dib'):''}<h1>${titulo}</h1><p>${bajada}</p></header>`;
function vAcomp(){
  const cards=[
    {href:'#/acompanar/conocer', ic:'conocer', t:'Conocer Educaplay Primaria', d:'Qué es esta propuesta y qué mundos, personajes e historias forman parte de ella.'},
    {href:'#/acompanar/estar-cerca', ic:'cerca', t:'Estar cerca', d:'Ideas breves para hacer en casa, ligadas a cada módulo.'},
    {href:'#/acompanar/aprendizajes', ic:'aprendizajes', t:'Aprendizajes en acción', d:'Qué aprendizajes se ponen en juego mientras juegan, exploran, conversan o resuelven.'},
    {href:'#/acompanar/habitar', ic:'habitar', t:'Habitar lo digital', d:'Autonomía, bienestar y momentos compartidos: claves para tomar pequeñas decisiones con confianza.'},
    {href:'#/acompanar/preguntas', ic:'preguntas', t:'Preguntas que nos hacemos', d:'Respuestas rápidas organizadas para entender, resolver, guiar o seguir.'}
  ];
  return `${topnav('acompanar')}<main class="amain" id="main" tabindex="-1">
   ${ahero('', 'Acompañar', 'Para quienes participan de las experiencias de niñas y niños desde distintos roles y contextos.', 'arte/galeria.webp')}
   <div class="cards3">${cards.map(c=>`<a class="tcard con-dib" href="${c.href}">${seccion(c.ic)}<h2>${c.t}</h2><p>${c.d}</p><span class="tcard-ir">Entrar ${ico('flecha')}</span></a>`).join('')}</div>
   <section class="panel suave"><h2 class="h2">Lo que van a encontrar</h2>
   <ul><li>Propuestas cortas, opcionales y sin materiales especiales.</li><li>Conversación, observación y juego, no tareas escolares.</li><li>Posibles en distintos hogares y sin necesidad de internet.</li><li>Todo conectado con lo que el niño hizo en Descubrir.</li></ul></section></main>${pie()}`;
}
function vConocer(){
  return `${topnav('acompanar')}<main class="amain" id="main" tabindex="-1">${crumbs([['Acompañar','#/acompanar'],['Conocer Educaplay Primaria',null]])}
   ${ahero('conocer','Conocer Educaplay Primaria','Interesarse, escuchar y aventurarse con los niños y las niñas.')}
   <div class="video-hueco" role="img" aria-label="Lugar reservado para el video de presentación">${ico('video')}<b>Video de presentación</b><span>A incorporar</span></div>
   <article class="res-body">${CONOCER.parrafos.map(p=>`<p>${p}</p>`).join('')}</article>
   <h2 class="h2" id="mundos">Conocer los mundos</h2><p class="bajada">${CONOCER.mundosBajada}</p>
   <div class="cards3">${GRADES.map(g=>{ const w=WORLDS[g]; return w.ready
      ? `<a class="tcard mundo" href="#/descubrir/${g}"><span class="tcard-foto" aria-hidden="true" style="background-image:url(arte/mapa-${w.id}.webp)"></span><h3>${w.name}</h3><p>${w.place} · ${ordinal(g)} grado</p><span class="chip dato">${ico('video')}Video a incorporar</span></a>`
      : `<div class="tcard soon"><span class="tcard-ico">${ico('niebla')}</span><h3>Universo del ${ordinal(g)} grado</h3><p>Se está preparando.</p></div>`; }).join('')}</div>
   <div class="fila"><a class="btn btn-zona" href="#/acompanar/estar-cerca">Ver ideas para estar cerca ${ico('flecha')}</a></div></main>${pie()}`;
}
function vEstarCerca(){
  const mods=Object.values(MODS);
  return `${topnav('acompanar')}<main class="amain" id="main" tabindex="-1">${crumbs([['Acompañar','#/acompanar'],['Estar cerca',null]])}
   ${ahero('cerca','Estar cerca','Acompañar también es estar cerca de lo que descubren, preguntan y disfrutan. Pequeños momentos compartidos pueden abrir nuevas oportunidades para aprender.')}
   <p class="bajada">Una idea breve por cada módulo de Descubrir.</p>
   <div class="cards3">${mods.map(m=>`<a class="tcard ${state.done[m.id]?'jugado':''}" href="#/acompanar/tarjeta/${m.id}"><span class="from">${glifo(m.icon)}${chipArea(m.area,m.grade)}</span><h3>${m.title}</h3><p>${m.card.consigna}</p><span class="fila">${chipDato('reloj',m.card.tiempo)}${state.done[m.id]?`<span class="chip jugado">${ico('tilde')}Ya lo jugó</span>`:''}</span></a>`).join('')}</div></main>${pie()}`;
}
function vHabitar(topic){
  if(!topic){
    return `${topnav('acompanar')}<main class="amain" id="main" tabindex="-1">${crumbs([['Acompañar','#/acompanar'],['Habitar lo digital',null]])}
     ${ahero('habitar','Habitar lo digital','Una pantalla en la mesa, un rato de juego, una pausa a tiempo: las experiencias digitales se van construyendo con pequeñas decisiones de todos los días. Acá ofrecemos algunas claves para tomarlas con confianza.')}
     <div class="cards3">${Object.entries(HABITAR).map(([k,g])=>`<a class="tcard" href="#/acompanar/habitar/${k}"><h2>${g.title}</h2><p>${g.sub}</p><span class="tcard-ir">${g.items.length} recursos ${ico('flecha')}</span></a>`).join('')}</div>
     <p class="consigna">${HABITAR_FRASE}</p></main>${pie()}`;
  }
  const g=HABITAR[topic]; if(!g) return null;
  return `${topnav('acompanar')}<main class="amain" id="main" tabindex="-1">${crumbs([['Acompañar','#/acompanar'],['Habitar lo digital','#/acompanar/habitar'],[g.title,null]])}
   ${ahero('habitar',g.title,g.sub)}
   <div class="cards3">${g.items.map(i=>`<a class="tcard" href="#/acompanar/habitar/${topic}/${i.id}"><h2>${i.title}</h2><p>${i.sum}</p><span class="fila">${chipDato('reloj','Lectura de '+i.min+' min')}<span class="chip dato">${i.grade}</span></span></a>`).join('')}</div>
   <div class="fila"><span class="ayuda">Seguir con:</span>${Object.keys(HABITAR).filter(k=>k!==topic).map(k=>`<a class="btn btn-sm" href="#/acompanar/habitar/${k}">${HABITAR[k].title}</a>`).join('')}</div></main>${pie()}`;
}
function vHabitarItem(topic,id){
  const g=HABITAR[topic]; const item=g&&g.items.find(i=>i.id===id); if(!item) return null;
  return `${topnav('acompanar')}<main class="amain" id="main" tabindex="-1">${crumbs([['Acompañar','#/acompanar'],['Habitar lo digital','#/acompanar/habitar'],[g.title,'#/acompanar/habitar/'+topic],[item.title,null]])}
   <article class="res-body"><span class="fila"><span class="chip dato">${g.title}</span>${chipDato('reloj','Lectura de '+item.min+' min')}</span><h1 class="ph1">${item.title}</h1>
    ${item.body.map(p=>`<p>${p}</p>`).join('')}<div class="tipbox"><h2>Ideas para probar</h2>${li(item.tips)}</div>
    <div class="fila no-print"><button class="btn" data-act="say" data-text="${esc(item.title+'. '+item.body.join(' '))}">${ico('parlante')}Escuchar</button><a class="btn btn-zona" href="#/acompanar/estar-cerca">Ver ideas para estar cerca</a><a class="enlace" href="#/acompanar/habitar/${topic}">Volver a ${g.title}</a></div></article></main>${pie()}`;
}
/* Preguntas que nos hacemos (P34, P35, D7). "Para resolver" responde en
   el lugar; las otras tres derivan a una sección. Se ven distinto. */
function vPreguntas(cat){
  const c = FAQ[cat] ? cat : 'entender';
  const directas = FAQ[c].items.some(i=>!i.to);
  const item = i => i.to ? `<a class="deriva" href="${i.to}"><b>${i.q}</b><span>Ir a ${i.toLabel} ${ico('flecha')}</span></a>` : `<details><summary>${i.q}</summary><p>${i.a}</p></details>`;
  return `${topnav('acompanar')}<main class="amain" id="main" tabindex="-1">${crumbs([['Acompañar','#/acompanar'],['Preguntas que nos hacemos',null]])}
   ${ahero('preguntas','Preguntas que nos hacemos','Respuestas rápidas organizadas para entender, resolver, guiar o seguir.')}
   <nav class="subtabs" aria-label="Tipo de pregunta">${Object.entries(FAQ).map(([k,f])=>`<a href="#/acompanar/preguntas/${k}" ${k===c?'aria-current="page"':''}>${f.label}</a>`).join('')}</nav>
   <p class="ayuda">${directas?'La respuesta está acá mismo: tocá una pregunta para abrirla.':'Cada pregunta te lleva a la sección que la responde.'}</p>
   <div class="faq">${FAQ[c].items.map(item).join('')}</div></main>${pie()}`;
}
function vTarjeta(id){
  const m=MODS[id]; if(!m) return null; const c=m.card;
  const sibl=modsOfGrade(m.grade).filter(x=>x.id!==id);
  return `${topnav('acompanar')}<main class="amain" id="main" tabindex="-1">${membrete('Estar cerca · idea para hacer en casa')}${crumbs([['Acompañar','#/acompanar'],['Estar cerca','#/acompanar/estar-cerca'],[m.title,null]])}
   <article class="tarj">
    <div class="rel"><span class="rel-ico" aria-hidden="true">${glifo(m.icon)}</span><span>Idea para estar cerca, a partir de <b>${m.title}</b></span>${chipArea(m.area,m.grade)}</div>
    <h1 class="consigna">${c.consigna}</h1>
    <div class="facts"><div class="fact">${ico('reloj')}<div><b>Tiempo aproximado</b>${c.tiempo}</div></div><div class="fact">${ico('personas')}<div><b>Con quién</b>${c.con}</div></div><div class="fact">${ico('materiales')}<div><b>Materiales</b>${c.materiales}</div></div></div>
    <section><h2>Algunas preguntas para conversar</h2><ul class="qs">${c.preguntas.map(p=>`<li>${ico('chat')}<span>“${p}”</span></li>`).join('')}</ul></section>
    <section class="forwho"><h2>Para quien acompaña</h2><p>${c.orientacion}</p></section>
    <div class="mas">
     <details><summary>Si quieren seguir</summary><p>${c.mas}</p></details>
     <details><summary>Para llevar a la escuela <span class="opt">(opcional)</span></summary><p>${c.aula}</p></details>
     <details><summary>Otras formas de hacerlo</summary>${li(c.adapt)}</details>
    </div>
    <p class="aviso">Esta propuesta es opcional y no se evalúa. Si no pueden hacerla, no pasa nada: el niño puede seguir jugando y aprendiendo igual.</p>
    <div class="fila no-print"><button class="btn" data-act="say" data-text="${esc(c.consigna)}">${ico('parlante')}Escuchar</button><button class="btn" data-act="print">${ico('imprimir')}Imprimir</button><button class="btn" data-act="toast" data-msg="Demostración: acá se compartiría por mensaje.">${ico('compartir')}Compartir</button><a class="btn btn-zona" href="#/descubrir/${m.grade}/modulo/${m.id}">${ico('jugar')}Ver la actividad del módulo</a></div>
   </article>
   ${sibl.length?`<h2 class="h2 no-print">Otras ideas para estar cerca</h2><div class="cards3 no-print">${sibl.map(x=>`<a class="tcard" href="#/acompanar/tarjeta/${x.id}"><span class="from">${glifo(x.icon)}${chipArea(x.area)}</span><h3>${x.title}</h3><span class="fila">${chipDato('reloj',x.card.tiempo)}</span></a>`).join('')}</div>`:''}</main>${pie()}`;
}
