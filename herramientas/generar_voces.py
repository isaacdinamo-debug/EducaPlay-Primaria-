"""Genera el catálogo por Higgsfield CLI y exporta MP3 locales normalizados.
Uso: python3 herramientas/generar_voces.py [--limit N]
Reanuda trabajos existentes; nunca vuelve a comprar un audio ya generado.
Las credenciales quedan bajo la gestión de la CLI, fuera del sitio.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import argparse
import json
import subprocess
import threading
import urllib.request

ROOT=Path(__file__).resolve().parents[1]
DIR=ROOT/'arte'/'voces'
CATALOG=DIR/'catalogo.json'
LOCK=threading.Lock()


def cli(*args):
    result=subprocess.run(['higgsfield',*args,'--json'],capture_output=True,text=True,timeout=360)
    if result.returncode:
        raise RuntimeError(result.stderr[-600:])
    return json.loads(result.stdout)


def save(catalog):
    with LOCK:
        snapshot=CATALOG.with_suffix('.parcial')
        snapshot.write_text(json.dumps(catalog,indent=2,ensure_ascii=False)+'\n')
        snapshot.replace(CATALOG)
        manifest={item['personaje']+'|'+item['texto']:item['src'] for item in catalog if item.get('src') and (ROOT/item['src']).exists()}
        manifest_temp=DIR/'audios.js.parcial'
        manifest_temp.write_text('const AUDIOS_VOZ = '+json.dumps(manifest,indent=2,ensure_ascii=False)+';\n')
        manifest_temp.replace(DIR/'audios.js')


def generate(item,cast,catalog):
    target=DIR/(item['id']+'.mp3')
    if target.exists() and item.get('src'):
        return 'reutilizado'
    voice=cast[item['personaje']]
    if not item.get('job_id'):
        ids=cli('generate','create','text2speech_v2','--prompt',item.get('texto_locucion',item['texto']),'--variant',voice['variant'],'--voice_id',voice['voice_id'],'--voice_type',voice['voice_type'])
        item.update(job_id=ids[0],voice_id=voice['voice_id'],variant=voice['variant'])
        save(catalog)
    job=cli('generate','get',item['job_id'])
    if job['status'] not in ['completed','failed','canceled']:
        job=cli('generate','wait',item['job_id'],'--quiet','--timeout','5m')
    if job.get('status')!='completed' or not job.get('result_url'):
        raise RuntimeError('No se completó el trabajo '+item['job_id'])
    temp=Path('/tmp/educaplay-voces-originales');temp.mkdir(exist_ok=True)
    source=temp/(item['id']+'.mp3')
    urllib.request.urlretrieve(job['result_url'],source)
    # Medición y normalización en dos pasadas; volumen coherente entre voces.
    measured=subprocess.run(['ffmpeg','-hide_banner','-i',str(source),'-af','loudnorm=I=-18:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    block=measured.stderr[measured.stderr.rfind('{'):];levels=json.JSONDecoder().raw_decode(block)[0]
    norm='loudnorm=I=-18:TP=-1.5:LRA=9:linear=true:'+':'.join(key+'='+levels[value] for key,value in [('measured_I','input_i'),('measured_TP','input_tp'),('measured_LRA','input_lra'),('measured_thresh','input_thresh'),('offset','target_offset')])
    partial=target.with_suffix('.parcial.mp3')
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(source),'-af',norm,'-ar','44100','-ac','1','-b:a','128k',str(partial)],check=True)
    partial.replace(target)
    duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(target)]))
    if duration<=0: raise RuntimeError('Audio vacío: '+item['id'])
    item.pop('error',None)
    item.update(src=str(target.relative_to(ROOT)),duration=round(duration,3),status='generated',qa='Pendiente de escucha editorial y validación de acento/pronunciación')
    save(catalog)
    return 'generado'


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--limit',type=int);args=parser.parse_args()
    catalog=json.loads(CATALOG.read_text());cast=json.loads((DIR/'reparto.json').read_text())
    pending=[x for x in catalog if not x.get('src') or not (ROOT/x['src']).exists()]
    if args.limit is not None: pending=pending[:args.limit]
    errors=[]
    with ThreadPoolExecutor(max_workers=3) as pool:
        futures={pool.submit(generate,item,cast,catalog):item for item in pending}
        for index,future in enumerate(as_completed(futures),1):
            item=futures[future]
            try: print(f'{index}/{len(pending)} {item["personaje"]} {item["id"]}: {future.result()}',flush=True)
            except Exception as error:
                item['error']=str(error);errors.append(item['id']);print(f'ERROR {item["id"]}: {error}',flush=True)
    save(catalog)
    if errors: raise SystemExit('Audios pendientes: '+','.join(errors))

if __name__=='__main__': main()
