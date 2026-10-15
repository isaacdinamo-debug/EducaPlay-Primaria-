"""Cierra los videos de bienvenida mediante ida y vuelta con transparencia.
Ejecutar con: uv run --with numpy python herramientas/cerrar_loops_bienvenida.py
Compara los cuadros de ambos lados del cierre en RGB premultiplicado y alfa.
Las pequeñas diferencias restantes corresponden a la compresión VP9.
"""
from pathlib import Path
import subprocess,json,numpy as np
root=Path(__file__).resolve().parents[1]/'arte'/'bienvenida'
(root/'loops-v3').mkdir(exist_ok=True)
report=[]
for name in ['arandu','tortuga','garza','kapi','yarara','caraya','yabiru']:
 src=root/f'{name}.webm';dst=root/'loops-v3'/f'{name}.webm'
 subprocess.run(['ffmpeg','-v','error','-y','-c:v','libvpx-vp9','-i',str(src),'-filter_complex','[0:v]split[f][r];[f]setpts=PTS-STARTPTS[fwd];[r]reverse,setpts=PTS-STARTPTS[rev];[fwd][rev]concat=n=2:v=1:a=0,format=yuva420p[out]','-map','[out]','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-b:v','0','-crf','18','-row-mt','1','-auto-alt-ref','0','-an',str(dst)],check=True)
 def jump(p):
  meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=width,height','-of','json',str(p)]))['streams'][0]
  w,h=meta['width'],meta['height'];raw=subprocess.check_output(['ffmpeg','-v','error','-c:v','libvpx-vp9','-i',str(p),'-f','rawvideo','-pix_fmt','rgba','-'])
  a=np.frombuffer(raw,dtype=np.uint8).reshape(-1,h,w,4)
  # Compare visible premultiplied RGB and alpha, ignoring invisible RGB noise.
  a=a[[0,-1]].astype(np.float32)/255
  a[...,:3]*=a[...,3:4]
  return round(float(np.mean(np.abs(a[0]-a[-1])))*255,4)
 report.append({'name':name,'before':jump(src),'after':jump(dst)})
 print(report[-1],flush=True)
(root/'loops-v3'/'verificacion.json').write_text(json.dumps(report,indent=2))
