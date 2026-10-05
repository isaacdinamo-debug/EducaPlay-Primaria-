"""Quita el papel crema de los clips de los compañeros y los deja como
video con transparencia (WebM VP9 con canal alfa), para que el personaje
quede parado sobre la escena, sin recuadro.

    python herramientas/clips_sin_fondo.py [garza-reposo ...]

Lee arte/companeros-video/<clip>.mp4 (ya empaquetado) y escribe
arte/companeros-video/<clip>.webm. Mismo criterio que recortar_kapi.py:
se borra el papel conectado con el borde del cuadro y los huecos crema,
pero no el blanco de los ojos ni las plumas blancas.

Safari no reproduce el alfa de WebM: ahí la página muestra la figura
recortada quieta (arte/cuerpo/<personaje>.webp).
"""
import os, sys, glob, subprocess, tempfile
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARPETA = os.path.join(RAIZ, "arte/companeros-video")

def sin_papel(im):
    # El papel se mide en cada cuadro (las esquinas son siempre papel) y se
    # borra sólo lo que tiene ese color, conectado con el borde. Un umbral
    # amplio se llevaba el blanco de las alas de la garza y la yabirú.
    a = np.asarray(im).astype(np.int16)
    esq = np.concatenate([a[:12, :12].reshape(-1, 3), a[:12, -12:].reshape(-1, 3), a[-12:, :12].reshape(-1, 3), a[-12:, -12:].reshape(-1, 3)])
    ref = np.median(esq, axis=0)
    dist = np.abs(a - ref).max(axis=2)
    papel = dist < 15
    et, _ = ndimage.label(papel)
    borde = np.unique(np.concatenate([et[0], et[-1], et[:, 0], et[:, -1]]))
    fondo = ndimage.binary_opening(np.isin(et, borde[borde != 0]), iterations=1)
    alfa = Image.fromarray(((~fondo) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))
    res = im.convert("RGBA"); res.putalpha(alfa)
    return res

def procesar(clip):
    src = os.path.join(CARPETA, clip + ".mp4"); dst = os.path.join(CARPETA, clip + ".webm")
    with tempfile.TemporaryDirectory() as t:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, os.path.join(t, "f%04d.png")], check=True)
        for f in sorted(glob.glob(os.path.join(t, "f*.png"))):
            sin_papel(Image.open(f).convert("RGB")).save(f)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "24", "-i", os.path.join(t, "f%04d.png"),
                        "-vf", "scale=360:480", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "40", "-row-mt", "1",
                        "-auto-alt-ref", "0", "-an", dst], check=True)
    return clip, os.path.getsize(dst)

if __name__ == "__main__":
    clips = sys.argv[1:] or sorted(os.path.basename(p)[:-4] for p in glob.glob(os.path.join(CARPETA, "*-*.mp4")))
    for c in clips:
        print(*procesar(c), flush=True)
