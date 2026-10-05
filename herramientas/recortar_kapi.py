"""Recorta a Kapi de un cuadro de sus videos: borra el papel crema por
inundación desde los bordes (así no se lleva el blanco de los ojos) y
deja un PNG con transparencia, ajustado al personaje.

    python recortar_kapi.py cuadro.png salida.png
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.int16)
# "papel": claro y poco saturado. El suelo de arena y el pasto quedan afuera.
r, g, b = a[..., 0], a[..., 1], a[..., 2]
papel = (r > 205) & (g > 195) & (b > 170) & ((r - b) < 62)
# El papel conectado con el borde del cuadro, más los huecos encerrados
# (entre las patas) que sean crema y no blanco puro: el blanco de los ojos
# y de los dientes se queda.
etiquetas, _ = ndimage.label(papel)
borde = np.unique(np.concatenate([etiquetas[0], etiquetas[-1], etiquetas[:, 0], etiquetas[:, -1]]))
fondo = np.isin(etiquetas, borde[borde != 0]) | (papel & (b < 228))
alfa = Image.fromarray((~fondo * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
res = im.convert("RGBA")
res.putalpha(alfa)
caja = Image.fromarray((~fondo * 255).astype(np.uint8)).getbbox()
m = 6
caja = (max(caja[0] - m, 0), max(caja[1] - m, 0), min(caja[2] + m, im.width), min(caja[3] + m, im.height))
res.crop(caja).save(out)
print(out, res.crop(caja).size)
