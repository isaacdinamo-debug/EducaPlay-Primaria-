"""Corta una lámina de insignias redondas sobre fondo blanco en una
imagen por insignia, con transparencia fuera del círculo.

    python cortar_lamina.py lamina.png carpeta nombre1 nombre2 ...

Los nombres van en orden de lectura: fila por fila, de izquierda a derecha.
"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

src, carpeta, nombres = sys.argv[1], sys.argv[2], sys.argv[3:]
im = Image.open(src).convert("RGB")
a = np.asarray(im)
tinta = ndimage.binary_fill_holes((a.min(axis=2) < 150))   # el contorno castaño y lo que encierra
etiquetas, n = ndimage.label(tinta)
cajas = ndimage.find_objects(etiquetas)
areas = ndimage.sum(tinta, etiquetas, range(1, n + 1))
orden = np.argsort(areas)[::-1][:len(nombres)]
cajas = [cajas[i] for i in orden]
alto = np.median([c[0].stop - c[0].start for c in cajas])
cajas.sort(key=lambda c: (round(c[0].start / alto), c[1].start))
os.makedirs(carpeta, exist_ok=True)
for nombre, (ys, xs) in zip(nombres, cajas):
    rec = im.crop((xs.start, ys.start, xs.stop, ys.stop)).convert("RGBA")
    m = Image.new("L", (rec.width * 4, rec.height * 4), 0)
    ImageDraw.Draw(m).ellipse((4, 4, m.width - 5, m.height - 5), fill=255)
    rec.putalpha(m.resize(rec.size, Image.LANCZOS))
    lado = max(rec.size)
    cuad = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    cuad.paste(rec, ((lado - rec.width) // 2, (lado - rec.height) // 2))
    cuad.resize((512, 512), Image.LANCZOS).save(os.path.join(carpeta, nombre + ".webp"), quality=88, method=6)
    print(nombre, rec.size)
