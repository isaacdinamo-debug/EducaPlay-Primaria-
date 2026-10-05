'use strict';
/* ======================================================================
   Arte del sitio: marca, íconos, glifos, escenografía y mapas
   ======================================================================
   Sigue la regla del universo de Kapi: formas planas, contorno castaño,
   sin gradientes ni sombras difusas. Los colores son los de la lámina de
   Kapi (ver :root en estilos.css); acá van en hexadecimal porque un SVG
   usado con <use> no siempre hereda las variables.

   Kapi no se redibuja: es el PNG y los videos aprobados, copiados de
   kapi-app. Lo demás (guacamayo, yacaré, aguará, casas) es arte de
   relleno hasta que llegue la ilustración definitiva. */

const TRAZO = '#2b1607';
const T = `stroke="${TRAZO}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;

/* ---------- Kapi: siempre de cuerpo entero ----------
   Las poses fijas son cuadros de sus propios videos aprobados, recortados
   con herramientas/recortar_kapi.py: es exactamente el mismo personaje.
   Un solo Kapi por pantalla. */
const kapiPose = (pose, cls='') => `<img class="kapi-pose ${cls}" src="arte/kapi/${pose}.webp" alt="" draggable="false">`;
const SIN_MOVIMIENTO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* El video se renderizó sobre un papel de color exacto (#f6ead4): el
   contenedor .mesa-kapi lleva ese mismo fondo y funde los bordes. */
function kapiVivo(estado){
  if(SIN_MOVIMIENTO) return `<img class="kapi-vivo" src="kapi/kapi-reposo.jpg" alt="" width="540" height="720">`;
  return `<video class="kapi-vivo" src="kapi/kapi-${estado}.mp4" poster="kapi/kapi-reposo.jpg" autoplay loop muted playsinline aria-hidden="true" width="540" height="720"></video>`;
}

/* ---------- Compañeros vivos ----------
   Igual que Kapi: un clip corto por gesto, sobre papel crema. Mientras un
   compañero no tenga sus clips (COMPANEROS_VIVOS), se muestra su insignia. */
const COMPANEROS_VIVOS = ['garza','yarara','caraya','guacamayo','tortuga','yabiru','ita','arandu','yvoty','jasy'];
/* Los personajes de 1.° grado del universo: viven en cada lugar del mapa. */
const PERSONAJES_1 = {ita:'Itá, el yacaré', arandu:'Arandu, el yaguareté', yvoty:'Yvoty, el ciervo de los pantanos', jasy:'Jasy, la aguará guazú'};
/* Los clips no tienen fondo (WebM con transparencia): el personaje queda
   parado sobre la escena. Safari no reproduce esa transparencia; ahí se
   muestra la figura recortada, quieta. */
const VIDEO_SIN_FONDO = !/^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent||'');
function companeroVivo(n, gesto, cls=''){
  const quieto = `<span class="comp-vivo ${cls}"><img src="arte/cuerpo/${n}.webp" alt="" draggable="false"></span>`;
  if(SIN_MOVIMIENTO || !VIDEO_SIN_FONDO || !COMPANEROS_VIVOS.includes(n)) return quieto;
  return `<span class="comp-vivo ${cls}"><video src="arte/companeros-video/${n}-${gesto}.webm" autoplay ${gesto==='reposo'?'loop':''} muted playsinline aria-hidden="true" data-quien="${n}"></video></span>`;
}
/* Un gesto (saluda, festeja) se reproduce una vez y el compañero vuelve a
   su reposo. Todos los clips empiezan y terminan en el mismo cuadro, así
   que el cambio no salta. */
function gestoCompanero(video, gesto){
  if(!video || !video.dataset.quien) return;
  const quien = video.dataset.quien;
  video.loop = false;
  video.src = `arte/companeros-video/${quien}-${gesto}.webm`;
  video.onended = () => { video.onended = null; video.loop = true; video.src = `arte/companeros-video/${quien}-reposo.webm`; video.play().catch(()=>{}); };
  video.play().catch(()=>{});
}

/* ---------- Botonera ilustrada ---------- */
const boton = (n, cls='') => `<img class="bico ${cls}" src="arte/botones/${n}.webp" alt="" draggable="false">`;
/* ---------- Ilustración de cada sección de Proyectar y Acompañar ---------- */
const seccion = (n, cls='') => `<img class="sec-dib ${cls}" src="arte/secciones/${n}.webp" alt="" draggable="false">`;

/* ---------- Marca ----------
   El wordmark es el arte oficial de Educaplay (el mismo archivo que usa
   Secundaria), sin redibujar. "Primaria" es una etiqueta aparte: no forma
   parte del logo. */
const marca = (cls='') => `<span class="marca ${cls}"><img class="marca-img" src="arte/marca/educaplay.webp" alt="Educaplay" width="1200" height="232"><span class="marca-s">Primaria</span></span>`;

/* ---------- Íconos de interfaz ----------
   Un solo color (currentColor), caja de 64, trazo de 5. Misma convención
   que los íconos de la app de Kapi. */
const S = 'fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"';
const I = {
  volver:`<path ${S} d="M38 14 20 32l18 18M22 32h30"/>`,
  flecha:`<path ${S} d="M26 14l18 18-18 18M12 32h30"/>`,
  cerrar:`<path ${S} d="M18 18l28 28M46 18 18 46"/>`,
  mapa:`<path ${S} d="M8 16l16-6 16 6 16-6v38l-16 6-16-6-16 6zM24 10v38M40 16v38"/>`,
  parlante:`<path fill="currentColor" d="M10 24h10l14-12v40L20 40H10z"/><path ${S} d="M42 22q8 10 0 20M48 14q12 18 0 36"/>`,
  parlanteOff:`<path fill="currentColor" d="M10 24h10l14-12v40L20 40H10z"/><path ${S} d="M42 24l14 16M56 24 42 40"/>`,
  cuaderno:`<rect x="12" y="8" width="42" height="48" rx="6" fill="currentColor"/><path d="M22 8v48" stroke="#fffaf0" stroke-width="4"/><path d="M30 22h16M30 32h16" stroke="#fffaf0" stroke-width="4" stroke-linecap="round"/>`,
  casa:`<path ${S} d="M10 30 32 12l22 18M16 26v26h32V26M27 52V38h10v14"/>`,
  buscar:`<circle ${S} cx="27" cy="27" r="16"/><path ${S} d="M39 39l15 15"/>`,
  reloj:`<circle ${S} cx="32" cy="32" r="22"/><path ${S} d="M32 18v14l10 7"/>`,
  personas:`<circle ${S} cx="22" cy="22" r="9"/><circle ${S} cx="44" cy="26" r="7"/><path ${S} d="M6 54q0-16 16-16t16 16M40 40q16-1 18 14"/>`,
  materiales:`<path ${S} d="M10 28h44l-5 26H15zM20 28q0-16 12-16t12 16"/>`,
  imprimir:`<path ${S} d="M18 24V10h28v14M18 44H8V24h48v20H46M18 36h28v18H18z"/>`,
  compartir:`<circle ${S} cx="16" cy="32" r="7"/><circle ${S} cx="46" cy="14" r="7"/><circle ${S} cx="46" cy="50" r="7"/><path ${S} d="M22 29l18-11M22 35l18 11"/>`,
  descargar:`<path ${S} d="M32 8v32M18 28l14 14 14-14M10 54h44"/>`,
  jugar:`<path fill="currentColor" d="M20 10l34 22-34 22z"/>`,
  tilde:`<path ${S} stroke-width="7" d="M12 34l13 13 27-30"/>`,
  chat:`<path ${S} d="M8 12h48v30H30L16 54V42H8z"/>`,
  guia:`<circle ${S} cx="32" cy="32" r="24"/><path fill="currentColor" d="M42 22 36 36 22 42l6-14z"/>`,
  verbos:`<path ${S} d="M8 50 20 14l12 36M12 40h16M40 30h16M48 22v28"/>`,
  duda:`<circle ${S} cx="32" cy="32" r="24"/><path ${S} d="M24 25q0-9 8-9t8 8q0 6-8 9v4"/><circle cx="32" cy="47" r="3.2" fill="currentColor"/>`,
  sinPantalla:`<rect ${S} x="6" y="12" width="52" height="34" rx="5"/><path ${S} d="M22 56h20M8 56l48-48"/>`,
  recursos:`<path ${S} d="M8 22l24-12 24 12v24L32 58 8 46zM8 22l24 12 24-12M32 34v24"/>`,
  lapiz:`<path ${S} d="M44 8l12 12-32 32-16 4 4-16zM38 14l12 12"/>`,
  mundo:`<circle ${S} cx="32" cy="32" r="24"/><path ${S} d="M8 32h48M32 8q-14 24 0 48M32 8q14 24 0 48"/>`,
  pantalla:`<rect ${S} x="18" y="6" width="28" height="52" rx="6"/><path ${S} d="M28 48h8"/>`,
  video:`<rect ${S} x="6" y="14" width="52" height="36" rx="6"/><path fill="currentColor" d="M26 22v20l18-10z"/>`,
  ficha:`<path ${S} d="M14 8h26l12 12v36H14zM40 8v12h12M22 32h20M22 42h20"/>`,
  cerca:`<path ${S} d="M32 54C8 38 8 14 22 14q7 0 10 8 3-8 10-8c14 0 14 24-10 40z"/>`,
  niebla:`<path ${S} d="M16 40a10 10 0 0 1 2-20 14 14 0 0 1 26-3 11 11 0 0 1 6 23zM12 50h30M48 50h6"/>`,
  estrella:`<path fill="currentColor" d="M32 6l8 18 20 2-15 13 5 19-18-11-18 11 5-19L4 26l20-2z"/>`,
  otro:`<path ${S} d="M12 26a22 22 0 0 1 40-6M52 38a22 22 0 0 1-40 6M52 8v12H40M12 56V44h12"/>`,
  ninos:`<circle ${S} cx="32" cy="24" r="14"/><path ${S} d="M26 26q6 6 12 0M12 56q2-14 20-14t20 14"/>`,
  docente:`<rect ${S} x="6" y="10" width="52" height="34" rx="4"/><path ${S} d="M16 22h20M16 32h12M22 56l10-12 10 12"/>`,
  huella:`<ellipse cx="32" cy="42" rx="14" ry="12" fill="currentColor"/><ellipse cx="14" cy="26" rx="5.5" ry="8" fill="currentColor" transform="rotate(-18 14 26)"/><ellipse cx="26" cy="18" rx="5.5" ry="8" fill="currentColor"/><ellipse cx="38" cy="18" rx="5.5" ry="8" fill="currentColor"/><ellipse cx="50" cy="26" rx="5.5" ry="8" fill="currentColor" transform="rotate(18 50 26)"/>`,
  punto:`<circle cx="32" cy="32" r="10" fill="currentColor"/>`
};
const ico = (n, cls='') => `<svg class="ico ${cls}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${I[n]||I.punto}</svg>`;

/* ---------- Insignias ilustradas ----------
   Lugares, hallazgos y compañeros son insignias redondas generadas en
   Higgsfield (arte/originales) y cortadas con herramientas/cortar_lamina.py.
   Lo que todavía no tiene ilustración cae en un dibujo de respaldo. */
const LUGARES = ['guacamayo','hoja','yacare','casa','brote','lancha','carta','pez','feria','isla'];
const HALLAZGOS = ['pluma','huella','flor','cesta','ancla','sello','escama','acordeon'];
/* Los compañeros llevan el nombre guaraní que ya tienen en el universo de Kapi. */
const COMPANEROS = [['garza','Yrupé','la garza'],['yarara','Mbyja','la yarará'],['caraya','Yvytu','el carayá'],['guacamayo','Tataendy','el guacamayo'],['tortuga','Yvy','la tortuga'],['yabiru','Ñasaindy','la yabirú']];
const RESPALDO = {
  aguara:`<g ${T}><path d="M22 40V60M30 42v18M42 42v18M50 40v20" fill="none" stroke-width="3"/><ellipse cx="36" cy="36" rx="18" ry="10" fill="#d9682b"/><path d="M44 30l8-14 8 6-6 12z" fill="#d9682b"/><path d="M52 16l-2-10 8 8z" fill="#d9682b"/><path d="M18 34q-10 0-10 10 8-2 12-6z" fill="${TRAZO}"/><circle cx="55" cy="19" r="1.4" fill="${TRAZO}" stroke="none"/></g>`,
  incognita:`<g ${T}><circle cx="32" cy="32" r="27" fill="#f2e6d1" stroke-dasharray="6 6"/><path d="M24 26q0-9 8-9t8 8q0 6-8 9v3" fill="none" stroke-width="4"/><circle cx="32" cy="45" r="2.5" fill="${TRAZO}" stroke="none"/></g>`
};
const insignia = (carpeta, n, cls) => `<img class="glifo insignia ${cls}" src="arte/${carpeta}/${n}.webp" alt="" draggable="false">`;
const respaldo = (n, cls) => `<svg class="glifo ${cls}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${RESPALDO[n]||RESPALDO.incognita}</svg>`;
const glifo = (n, cls='') => LUGARES.includes(n) ? insignia('lugares',n,cls) : respaldo(n,cls);
const hallazgo = (n, cls='') => HALLAZGOS.includes(n) ? insignia('hallazgos',n,cls) : respaldo('incognita',cls);
/* Dibujos de las tarjetas de las actividades: animales de Corrientes y
   escenas. Cada tarjeta nombra su dibujo en datos.js. */
const DIBUJOS = {
  animales:['sabalo','dorado','palometa','boga','siriri','garza','hornero','guacamayo','tortuga','caraya','yaguarete','yacare'],
  tarjetas:['amanecer','yacare-camalotes','kapi-yacare','agua','arbol','escuela','almacen','plaza','saludo','invitacion','abrazo','firma','naranja','chipa','miel']
};
function dib(n){
  if(n==='flor-camalote') return insignia('hallazgos','flor','dib');
  if(n==='pluma') return insignia('hallazgos','pluma','dib');
  for(const carpeta in DIBUJOS) if(DIBUJOS[carpeta].includes(n)) return insignia(carpeta,n,'dib');
  return ico('duda','dib');
}
/* Objetos de juego, con fondo transparente. */
const objeto = n => `<img class="obj" src="arte/objetos/${n}.webp" alt="" draggable="false">`;
const companero = (n, cls='') => COMPANEROS.some(c=>c[0]===n) ? insignia('companeros',n,cls) : respaldo('incognita',cls);

const SPRITE = '';

/* El fruto del monte es una pitanga. */
const FRUIT = objeto('pitanga');

/* El árbol de pitanga: los frutos se ubican encima, sobre la copa. */
const TREE_SCENE = `<img class="tree-svg" src="arte/objetos/arbol.webp" alt="" draggable="false">`;

/* ---------- Ondas: el agua de las ilustraciones se mueve ----------
   Es lo único que se mueve solo en la plataforma, como en la app de Kapi.
   Va superpuesto a la parte de agua de un paisaje. */
const ondas = pts => `<svg class="ondas" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><g stroke="#e9f6f3" stroke-width="5" fill="none" stroke-linecap="round">${pts.map(([x,y],i)=>`<path class="rizo" style="--demora:${-i*1.3}s" d="M${x} ${y}q16-9 32 0t32 0"/>`).join('')}</g></svg>`;

/* ---------- El mapa ----------
   El paisaje es una ilustración (arte/mapa-<mundo>.webp). Encima va sólo
   lo que se toca: los lugares, la niebla y el guía. Las coordenadas de
   cada lugar (datos.js) están puestas sobre el claro que le corresponde
   en el dibujo, en una grilla de 1000 x 667.

   Estados de un lugar, siempre por forma además de color:
     actual   · anillo de oro que late y Kapi al lado
     hecho    · tilde
     niebla   · sin jugar; se puede tocar igual (la niebla es recompensa,
                no candado)
     pronto   · borde punteado                                            */
const R_NODO = 54;
const MAPA_ALTO = 667;
const niebla = (x,y,cls) => `<g class="fog ${cls}" transform="translate(${x} ${y})"><ellipse cx="-62" cy="-28" rx="58" ry="30"/><ellipse cx="54" cy="-44" rx="64" ry="32"/><ellipse cx="78" cy="30" rx="58" ry="28"/><ellipse cx="-64" cy="38" rx="60" ry="28"/></g>`;

function mapSVG(world, view){
  const w = world, r = R_NODO;
  let s = `<svg viewBox="0 0 1000 ${MAPA_ALTO}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mapa de ${w.name}">
   <image href="arte/mapa-${w.id}.webp" width="1000" height="${MAPA_ALTO}" preserveAspectRatio="xMidYMid slice"/>`;
  if(w.rizos) s += `<g class="rizos-mapa" stroke="#e9f6f3" stroke-width="5" fill="none" stroke-linecap="round">${w.rizos.map(([x,y],i)=>`<path class="rizo" style="--demora:${-i*1.3}s" d="M${x} ${y}q14-8 28 0t28 0"/>`).join('')}</g>`;
  s += `<g class="nube-mapa" style="--demora:0s"><path d="M-70 96a16 16 0 0 1 6-30 24 24 0 0 1 44-6 19 19 0 0 1 34 36z"/></g><g class="nube-mapa lenta" style="--demora:-34s"><path d="M-70 232a13 13 0 0 1 5-25 19 19 0 0 1 36-5 16 16 0 0 1 28 30z"/></g>`;
  w.nodes.forEach(n=>{
    const st = view.status(n);
    if(st==='niebla') s += niebla(n.x,n.y,'');
    else if(st==='hecho' && view.isNew(n.mod)) s += niebla(n.x,n.y,'lift');
  });
  w.nodes.forEach((n,i)=>{
    const st = view.status(n);
    const nombre = n.title || MODS[n.mod].title;
    const extra = {niebla:' (todavía con niebla)', pronto:' (próximamente)', hecho:' (ya lo jugaste)', actual:''}[st];
    s += `<g class="node ${st}" data-node="${n.id}" style="--i:${i}" transform="translate(${n.x} ${n.y})" tabindex="0" role="button" aria-label="${n.zone}: ${nombre}${extra}">
      <circle class="halo" r="${r+14}"/><circle class="canto" r="${r+3}" cy="7"/>
      <g class="tecla"><circle class="base" r="${r+3}"/><image class="dibujo" href="arte/lugares/${n.icon}.webp" x="${-r}" y="${-r}" width="${r*2}" height="${r*2}"/></g>
      ${st==='hecho'?`<g transform="translate(36 -36)"><circle r="17" fill="#52633b" stroke="#fffaf0" stroke-width="3"/><path d="M-7 0l5 6 10-12" stroke="#fffaf0" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`:''}
      <text class="lab" y="${r+40}">${n.zone}</text>
    </g>`;
  });
  {
    /* el guía del mundo: Kapi en 1.°, Tataendy en 2.° */
    const av = view.avatar, img = w.avatar==='kapi' ? 'arte/kapi/reposo.webp' : `arte/cuerpo/${w.avatar}.webp`;
    s += `<g class="avatar ${av.fromX!==av.x||av.fromY!==av.y?'camina':''}" id="avatar" style="transform:translate(${av.fromX}px,${av.fromY}px)"><image class="paso-kapi" href="${img}" x="-50" y="-122" width="100" height="122"/></g>`;
  }
  return s + '</svg>';
}
