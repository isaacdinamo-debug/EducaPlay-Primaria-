// Regresiones de coordinación del audio; no usa servicios ni reproduce sonido.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const root=path.dirname(__dirname);
function setup({supported=true,manifest={}}={}){
 const events={},audios=[],utterances=[],notices=[],caption={textContent:''};
 const synth={getVoices:()=>[{lang:'en-US'},{lang:'es-AR',name:'Español'}],addEventListener(){},cancel(){},speak(u){utterances.push(u)}};
 class AudioMock{constructor(src){this.src=src;audios.push(this);}play(){return Promise.resolve();}pause(){this.paused=true;}remove(){}}
 const context={console,Audio:AudioMock,SpeechSynthesisUtterance:function(text){this.text=text;},window:{addEventListener(){},...(supported?{speechSynthesis:synth}:{})},document:{addEventListener:(name,fn)=>events[name]=fn,hidden:false,body:{appendChild(){}}},$:()=>caption,toast:t=>notices.push(t),state:{voz:true,me:'garza'},P:{mod:{buddy:'guaca',stations:[{}]},i:0},AUDIOS_VOZ:manifest};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'js/sonido.js'),'utf8'),context);
 const run=code=>vm.runInContext(code,context);
 return {run,events,audios,utterances,notices,caption,context};
}
let t=setup();t.run("speak('Primera'); speak('Actual');");assert.equal(t.utterances.length,0);t.events.pointerdown({type:'pointerdown'});assert.deepEqual(t.utterances.map(u=>u.text),['Actual']);assert.equal(t.utterances[0].voice.lang,'es-AR');
t=setup();t.events.pointerdown({type:'pointerdown'});t.run("speak('Consigna'); speak('Festejo',{personaje:'garza',sumar:true});");assert.equal(t.utterances.length,1);t.utterances[0].onend();assert.equal(t.utterances[1].text,'Festejo');assert.match(t.caption.textContent,/Yrupé/);
t=setup();t.events.pointerdown({type:'pointerdown'});t.run("speak('Vieja');speak('Pendiente',{sumar:true});detenerVoz();");t.utterances[0].onend();assert.equal(t.utterances.length,1);
t=setup();t.events.pointerdown({type:'pointerdown'});t.run("state.voz=false;speak('Silenciada');");assert.equal(t.utterances.length,0);t.run('repetirVoz();');assert.equal(t.utterances.length,1);assert.equal(t.context.state.voz,false);
t=setup({manifest:{'guacamayo|Hola':'arte/voces/hola.mp3'}});t.events.pointerdown({type:'pointerdown'});t.run("speak('Hola');");assert.equal(t.audios[0].src,'arte/voces/hola.mp3');assert.equal(t.utterances.length,0);t.audios[0].onerror();t.audios[0].onerror();assert.equal(t.utterances.length,1);t.run('detenerVoz();');assert.equal(t.audios[0].paused,true);
t=setup({supported:false});t.events.pointerdown({type:'pointerdown'});t.run("speak('Texto disponible');");assert.match(t.caption.textContent,/Texto disponible/);assert.equal(t.notices.length,1);
t=setup();t.events.pointerdown({type:'pointerdown'});t.run("speak('Actual');");t.context.document.hidden=true;t.events.visibilitychange();t.run("speak('Otro',{sumar:true});"); // La cola anterior ya no existe.
assert.equal(t.utterances.length,1);t.context.document.hidden=false;t.run('repetirVoz();');assert.equal(t.utterances.length,2);
// Migración: el apagado heredado se reemplaza una vez; el nuevo silencio persiste.
const activities=fs.readFileSync(path.join(root,'js/actividades.js'),'utf8'),app=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
for(const [saved,expected] of [[null,true],[{voz:false},true],[{vozVersion:1,voz:false},false],[{vozVersion:1,voz:true},true],[{vozVersion:1},true]]){
 const context={localStorage:{getItem:()=>JSON.stringify(saved)},WORLDS:{}};vm.createContext(context);
 vm.runInContext("const CLAVE='test';"+activities.match(/const state = .*;/)[0]+app.slice(app.indexOf('function cargar(){'),app.indexOf('/* ============ módulo infantil'))+'cargar();result=state.voz;',context);assert.equal(context.result,expected);
}
// Repetir consigna no reproduce la última devolución o el festejo.
t=setup();t.events.pointerdown({type:'pointerdown'});t.context.P.consigna='Consigna original';t.context.P.last='Devolución';t.run(app.slice(app.indexOf('const ACT = {'),app.indexOf("document.addEventListener('click'"))+"ACT.speak();");assert.equal(t.utterances[0].text,'Consigna original');
console.log('Audio: cola, interrupción, silencio, repetición, respaldo, subtítulos y migración verificados.');
