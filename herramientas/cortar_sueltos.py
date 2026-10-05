"""Separa una lámina de figuras sueltas en una imagen por figura, con
transparencia. Sirve para dos casos:

    python cortar_sueltos.py alfa  lamina.png carpeta nombre1 nombre2 ...
        la lámina ya trae fondo transparente (objetos de juego)

    python cortar_sueltos.py papel lamina.png carpeta nombre1 nombre2 ...
        la lámina tiene fondo crema (poses de Kapi): se borra el papel sin
        llevarse el blanco de los ojos ni de los dientes

Los nombres van de izquierda a derecha.
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

modo, src, carpeta, nombres = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
im = Image.open(src)
if modo == "alfa":
    im = im.convert("RGBA")
    figura = np.asarray(im)[..., 3] > 24
else:
    im = im.convert("RGB")
    a = np.asarray(im).astype(np.int16)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    papel = (r > 205) & (g > 195) & (b > 170) & ((r - b) < 62)
    et, _ = ndimage.label(papel)
    borde = np.unique(np.concatenate([et[0], et[-1], et[:, 0], et[:, -1]]))
    fondo = np.isin(et, borde[borde != 0]) | (papel & (b < 228))
    figura = ~fondo
    alfa = Image.fromarray((figura * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
    im = im.convert("RGBA"); im.putalpha(alfa)
# cada figura es una isla; se unen los pedacitos cercanos (un ojo, una hoja suelta)
islas, n = ndimage.label(ndimage.binary_dilation(figura, iterations=int(os.environ.get("UNIR", 12))))
areas = ndimage.sum(figura, islas, range(1, n + 1))
cajas = ndimage.find_objects(islas)
elegidas = sorted([cajas[i] for i in np.argsort(areas)[::-1][:len(nombres)]], key=lambda c: c[1].start)
os.makedirs(carpeta, exist_ok=True)
for nombre, (ys, xs) in zip(nombres, elegidas):
    rec = im.crop((xs.start, ys.start, xs.stop, ys.stop))
    rec.save(os.path.join(carpeta, nombre + ".webp"), quality=92, method=6)
    print(nombre, rec.size)
