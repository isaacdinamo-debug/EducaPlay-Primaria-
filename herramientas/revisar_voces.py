"""Crea una sala de escucha local y verifica que cada registro tenga un MP3.
Uso: python3 herramientas/revisar_voces.py
"""
from pathlib import Path
import html
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'arte'/'voces'
NAMES={'kapi':'Kapi','guacamayo':'Tataendy','ita':'Itá','garza':'Yrupé','yarara':'Mbyja','caraya':'Yvytu','tortuga':'Yvy','yabiru':'Ñasaindy','arandu':'Arandu','yvoty':'Yvoty','jasy':'Jasy'}


def check(item):
    if not item.get('src'): return item['id']+': falta producir'
    path=ROOT/item['src']
    if not path.exists(): return item['id']+': falta archivo'
    result=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','null','-'],capture_output=True,text=True)
    if result.returncode: return item['id']+': audio inválido'
    if item['duration']<0.3 or item['duration']>60: return item['id']+': revisar duración'
    return None


def main():
    catalog=json.loads((DATA/'catalogo.json').read_text())
    with ThreadPoolExecutor(max_workers=4) as pool: problems=[p for p in pool.map(check,catalog) if p]
    cast=json.loads((DATA/'reparto.json').read_text())
    cards=[]
    for actor in cast:
        lines=[x for x in catalog if x['personaje']==actor]
        rows=[]
        for line in lines:
            text=html.escape(line['texto']);source=html.escape(line.get('src',''))
            player=f'<audio controls preload="none" src="../{source}" aria-label="Escuchar: {text}"></audio>' if source else '<p class="pending">Pendiente de producir</p>'
            rows.append(f'<article><p>{text}</p>{player}<small>{line["id"]}</small></article>')
        unit='parlamento' if len(lines)==1 else 'parlamentos'
        cards.append(f'<details><summary>{NAMES[actor]} · {html.escape(cast[actor]["voice_name"])} · {len(lines)} {unit}</summary><div class="clips">'+''.join(rows)+'</div></details>')
    page='''<!doctype html><html lang="es-AR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Revisión de voces · Educa Primaria</title>
<style>body{max-width:1080px;margin:auto;padding:24px;font:17px/1.5 system-ui;background:#fcf6e9;color:#3b2a22}h1{line-height:1.15}a{color:#245c5b}input{box-sizing:border-box;width:100%;padding:12px;font:inherit;border:2px solid #72513b;border-radius:10px}summary{cursor:pointer;font-weight:700;padding:16px;background:#e8ddbd;border-radius:12px;margin:20px 0 12px}.clips{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:14px}article{padding:16px;border:1px solid #c7b99f;border-radius:12px;background:white}article p{min-height:3em}audio{width:100%}small{display:block;color:#70645b;font-size:11px}.pending{color:#ad382e}[hidden]{display:none!important}</style>
<header><a href="../#/inicio">Volver al juego</a><h1>Revisión de voces</h1><p>Voces de trabajo generadas con Higgsfield. Escuchá antes de aprobar timbre, acento, pronunciación de nombres y energía del festejo. Los controles reproducen una voz por vez.</p><label for="filter">Buscar una frase</label><input id="filter" type="search" placeholder="Por ejemplo: aventura, Kapi, frutos…"></header>'''+''.join(cards)+'''
<script>document.addEventListener('play',e=>{if(e.target.matches('audio'))document.querySelectorAll('audio').forEach(a=>{if(a!==e.target)a.pause()})},true);document.querySelector('#filter').addEventListener('input',e=>{const q=e.target.value.toLocaleLowerCase('es');document.querySelectorAll('article').forEach(c=>c.hidden=!c.querySelector('p').textContent.toLocaleLowerCase('es').includes(q));document.querySelectorAll('details').forEach(d=>{d.hidden=![...d.querySelectorAll('article')].some(c=>!c.hidden);if(q)d.open=true})});</script></html>'''
    (ROOT/'herramientas'/'escucha-voces.html').write_text(page)
    report={'entries':len(catalog),'generated':sum(bool(x.get('src')) for x in catalog),'problems':problems,'editorial_listening':'pending','device_matrix':'Chrome desktop smoke test only; Safari/Android and screen-reader testing pending'}
    (DATA/'verificacion.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
    print(json.dumps(report,ensure_ascii=False))
    if problems: raise SystemExit(1)

if __name__=='__main__': main()
