// Inventario reproducible de parlamentos. No genera ni compra audios.
const fs=require('fs'),vm=require('vm'),path=require('path'),crypto=require('crypto');
const root=path.dirname(__dirname);
const context={window:{matchMedia:()=>({matches:false}),addEventListener(){}},navigator:{userAgent:'Chrome'},document:{addEventListener(){}}};
vm.createContext(context);
vm.runInContext(['arte','datos','actividades','sonido'].map(n=>fs.readFileSync(path.join(root,'js',n+'.js'),'utf8')).join('\n')+'\nglobalThis.inventory={MODS,WORLDS,COMPANEROS,PERSONAJES_1,FESTEJOS_VOZ,STN,GUIA_MODULO};',context);
const {MODS,WORLDS,COMPANEROS,PERSONAJES_1,FESTEJOS_VOZ,STN,GUIA_MODULO}=context.inventory;
const lines=new Map();
function add(personaje,texto){
 if(!texto) return;
 texto=texto.normalize('NFC').replace(/\s+/g,' ').trim();
 const key=personaje+'|'+texto;
 lines.set(key,{id:crypto.createHash('sha256').update(key).digest('hex').slice(0,16),personaje,texto});
}
function literals(source){
 // Sólo literales completos presentes en llamadas ctx.say; los mensajes
 // calculados se inventarían abajo desde los datos que los alimentan.
 for(const call of source.matchAll(/ctx\.say\(([^;\n]+)/g)){
  for(const match of call[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)){
   const value=match[1].replace(/\\'/g,"'");
   if(value.length>18 && /[.!?…]$/.test(value) && !/[<>#{}]/.test(value)) yieldText.push(value);
  }
 }
}
let yieldText=[];
for(const m of Object.values(MODS)){
 const actor=GUIA_MODULO[m.buddy];
 for(const st of m.stations){
  yieldText=[];literals(STN[st.type].toString());yieldText.forEach(t=>add(actor,t));
  for(const key of ['intro','hint','ok','ask']) add(actor,st[key]);
  if(st.hint) add(actor,'Una pista: '+st.hint);
  for(const item of st.items||[]){if(item.t){add(actor,item.t);add(actor,item.t+' … ¿Y después?');}}
  for(const pair of st.pairs||[]) add(actor,pair.b);
  if(st.ans!==undefined) add(actor,'¡Eso! Subieron '+st.ans+' pasajeros.');
 }
 add(actor,'¡Aventura completada! Encontraste '+m.reward.name+'.');
 add(actor,m.card.voz);
}
for(const [id,name] of COMPANEROS){
 add(id,'Soy '+name+'. ¡Vamos a explorar juntos!');
 add(id,FESTEJOS_VOZ[id]);
 for(const button of ['Seguir','Terminar']) add(id,'¡Lo lograste! Tocá '+button+' cuando quieras continuar.');
}
for(const actor of ['kapi','ita']){
 add(actor,FESTEJOS_VOZ[actor]);
 for(const button of ['Seguir','Terminar']) add(actor,'¡Lo lograste! Tocá '+button+' cuando quieras continuar.');
}
for(const t of [
 '¡Hola! Soy Kapi. Tocá Comenzar para entrar a Educa Primaria. Podés silenciar la voz cuando quieras.',
 'Para jugar, elegí Descubrir. Proyectar es para docentes y Acompañar es para las familias.',
 '¿Quién sos hoy? Elegí un compañero para tu cuaderno. Podés cambiarlo después.',
 'Elegí tu mundo. Podés entrar al Mundo de Kapi o al Río de Tataendy.',
 'Este mundo se está preparando. Podés elegir otro mundo.',
 '¿Quién sos hoy? Tocá un dibujo para tu cuaderno de campo.',
 'Elegí tu mundo. Cada grado tiene su propio universo, su mapa y sus personajes.'
]) add('kapi',t);
for(const w of Object.values(WORLDS).filter(w=>w.ready)){
 const actor=w.avatar==='guacamayo'?'guacamayo':'kapi';
 add(actor,w.mission);add(actor,w.mission+' Tocá un lugar del mapa para conocer su aventura.');
 for(const n of w.nodes){
  if(n.soon) add(n.guia||w.avatar,n.title+'. '+n.blurb+' Volvé pronto.');
  else{const m=MODS[n.mod];add(n.guia||w.avatar,m.title+'. '+m.blurb+' Tocá Entrar para jugar.');add(n.guia||w.avatar,m.title+'. '+m.blurb);}
 }
}
for(let count=0;count<=Object.keys(MODS).length;count++) add('kapi','Tu cuaderno tiene '+count+(count===1?' hallazgo.':' hallazgos.')+' Cada aventura completada deja un hallazgo nuevo.');
const catalogPath=path.join(root,'arte/voces/catalogo.json');
const previous=fs.existsSync(catalogPath)?JSON.parse(fs.readFileSync(catalogPath)):[];
const byKey=new Map(previous.map(x=>[x.id,x]));
const result=[...lines.values()].map(x=>({...byKey.get(x.id),...x,...(/^\$\d+$/.test(x.texto)?{texto_locucion:x.texto.slice(1)+' pesos'}:{})}));
fs.writeFileSync(catalogPath,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({parlamentos:result.length,caracteres:result.reduce((n,x)=>n+x.texto.length,0),porPersonaje:result.reduce((n,x)=>(n[x.personaje]=(n[x.personaje]||0)+1,n),{})},null,2));
