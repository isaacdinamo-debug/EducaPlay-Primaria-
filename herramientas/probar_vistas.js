// Carga todo el JS con un DOM mínimo simulado, renderiza cada vista y
// comprueba que no haya errores, emojis ni imágenes que no existan.
//   node herramientas/probar_vistas.js
const fs=require('fs'), path=require('path');
const raiz=path.dirname(__dirname);
const el=()=>({classList:{add(){},remove(){},toggle(){},contains(){return false}},dataset:{},style:{},setAttribute(){},appendChild(){},focus(){},addEventListener(){},insertAdjacentHTML(){},remove(){},scrollIntoView(){},innerHTML:'',querySelector:()=>null,querySelectorAll:()=>[]});
global.window={matchMedia:()=>({matches:false}),addEventListener(){},scrollTo(){}};
global.document={querySelector:()=>el(),querySelectorAll:()=>[],addEventListener(){},createElement:el,body:el(),title:''};
global.location={hash:''};global.localStorage={getItem:()=>null,setItem(){}};global.requestAnimationFrame=()=>{};
let src=['arte','datos','actividades','vistas','app'].map(f=>fs.readFileSync(path.join(raiz,'js',f+'.js'),'utf8')).join('\n').replace(/'use strict';/g,'');
src+=`
state.me='garza';
const vistas={intro:()=>vIntro(),inicio:()=>vInicio(),equipo:()=>vEquipo(),elegir:()=>vElegir(),explorar:()=>vExplorar(),w1:()=>vWorld(1),w2:()=>vWorld(2),w3:()=>vWorld(3),
 ...Object.fromEntries(Object.values(MODS).flatMap(m=>[['mod-'+m.id,()=>vModule(m.grade,m.id)],['ficha-'+m.id,()=>vSheet(m.id,'accion')],['tarj-'+m.id,()=>vTarjeta(m.id)],['sinp-'+m.id,()=>vSinPantallasItem(m.id)]])),
 hub:()=>vProyectarHub(),guias:()=>vGuias({}),guias1:()=>vGuias({g:'1'}),guias1mat:()=>vGuias({g:'1',a:'mat',e:'num',c:'com-col'}),guias3:()=>vGuias({g:'3'}),buscar:()=>vSearch({q:'comparación de colecciones'}),buscar0:()=>vSearch({q:'zzzz'}),
 sinp:()=>vSinPantallasList(),rec:()=>vRecursosAula(),cuad:()=>vCuadernoList(),qps:()=>vQuePasaSi(),verbosP:()=>vVerbos('proyectar'),verboP:()=>vVerbos('proyectar','comparar'),verbosA:()=>vVerbos('acompanar'),verboA:()=>vVerbos('acompanar','contar'),
 acomp:()=>vAcomp(),conocer:()=>vConocer(),cerca:()=>vEstarCerca(),habitar:()=>vHabitar(),
 ...Object.fromEntries(Object.keys(HABITAR).flatMap(k=>[['hab-'+k,()=>vHabitar(k)],...HABITAR[k].items.map(i=>['hab-'+k+'-'+i.id,()=>vHabitarItem(k,i.id)])])),
 ...Object.fromEntries(Object.keys(FAQ).map(k=>['faq-'+k,()=>vPreguntas(k)]))};
globalThis.__r={mal:0,html:''};
const emo=/[\\u{1F300}-\\u{1FAFF}\\u2600-\\u27BF\\u2B50]/u;
for(const [k,f] of Object.entries(vistas)){ try{ const h=f(); if(!h||/undefined|\\[object|NaN/.test(h)){__r.mal++;console.log('RARO',k);} else { if(emo.test(h)) console.log('emoji en',k,h.match(emo)[0]); __r.html+=h; } }catch(e){__r.mal++;console.log('ERROR',k,e.message);} }
__r.n=Object.keys(vistas).length;
// lo que dibujan las actividades y las ventanas
__r.html+=FRUIT+['pichon','pasajero','lancha'].map(objeto).join('')+Object.values(MODS).map(m=>hallazgo(m.reward.icon)+glifo(m.icon)).join('')+COMPANEROS.map(c=>companero(c[0])).join('')
 +Object.values(MODS).flatMap(m=>m.stations).flatMap(st=>[...(st.items||[]).map(i=>dib(i.em)),...(st.bins||[]).map(b=>dib(b.em)),...(st.pairs||[]).map(p=>dib(p.a)),st.media?dib(st.media):'']).join('')
 +['reposo','saluda','senala','celebra','piensa','anima'].map(p=>kapiPose(p)).join('')
 +['volver','mapa','cuaderno','casa','voz','seguir','jugar','cerrar'].map(b=>boton(b)).join('')+COMPANEROS.map(c=>companeroVivo(c[0],'reposo')).join('');
__r.emoDatos=(JSON.stringify(MODS).match(new RegExp(emo.source,'gu'))||[]);
`;
eval(src);
const r=globalThis.__r;
const rutas=new Set([...r.html.matchAll(/(?:src|href)="((?:arte|kapi)\/[^"]+)"/g),...r.html.matchAll(/url\(((?:arte|kapi)\/[^)]+)\)/g)].map(m=>m[1]));
const css=fs.readFileSync(path.join(raiz,'estilos.css'),'utf8');
for(const m of css.matchAll(/url\(((?:arte|kapi|fuentes)\/[^)]+)\)/g)) rutas.add(m[1]);
const faltan=[...rutas].filter(p=>!fs.existsSync(path.join(raiz,p)));
console.log(r.n+' vistas, '+r.mal+' con problemas');
console.log(rutas.size+' archivos referenciados, faltan '+faltan.length, faltan);
console.log('emojis en los datos de módulos: '+r.emoDatos.length, r.emoDatos.join(''));
