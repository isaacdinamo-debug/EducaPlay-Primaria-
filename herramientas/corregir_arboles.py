"""Corrige el lapacho y la palmera en cada imagen ya aprobada, usando la
lámina arte/originales/v3/arboles.png como modelo. Edita sobre la imagen
original, así no se mueven los lugares del mapa.

    python3 herramientas/corregir_arboles.py [nombre ...]

La versión anterior queda en arte/originales/v3/descartadas/<nombre>-antes-arboles.png.
"""
import json, os, subprocess, sys, shutil, urllib.request
from concurrent.futures import ThreadPoolExecutor
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V3 = os.path.join(RAIZ, "arte/originales/v3")
ARBOLES = os.path.join(V3, "arboles.png")
IMAGENES = {"esteros": "16:9", "mapa-kapi": "3:2", "mapa-aguara": "3:2", "fondo-monte": "16:9",
            "fondo-rio": "16:9", "galeria": "16:9", "aula": "16:9", "lugares": "16:9"}
PEDIDO = ("Edit the FIRST image. Keep everything in it EXACTLY identical, pixel for pixel: same composition, same positions, same "
    "sizes, same clearings, paths, water, buildings, boats, badges and every other element, same flat style, same dark brown outline, "
    "same colors. Change ONLY the trees: (1) every palm tree becomes a CARANDAY palm drawn exactly like the palm on the right of the "
    "SECOND image: slender straight grey-brown trunk with crisscross leaf bases at the bottom and a round crown of fan-shaped green "
    "leaves, a few lower fans yellowish; (2) every pink-flowered tree becomes a pink LAPACHO drawn exactly like the tree on the left "
    "of the SECOND image: branching brown trunk with airy scalloped clusters of pink flowers. Each new tree stands in the same place "
    "and at the same size as the tree it replaces. If there is no palm or no pink tree, change nothing. Do not add new trees. "
    "No texture, no shading, no gradients, no text.")

def correr(n):
    dest = os.path.join(V3, n + ".png")
    copia = os.path.join(V3, "descartadas", n + "-antes-arboles.png")
    if os.path.exists(copia): return n, "ya estaba"
    cmd = ["higgsfield", "generate", "create", "seedream_5_0_flash", "--image", dest, "--image", ARBOLES, "--aspect_ratio", IMAGENES[n],
           "--resolution", "2k", "--prompt", PEDIDO, "--wait", "--wait-timeout", "15m", "--json"]
    r = subprocess.run(cmd, capture_output=True, text=True)
    try:
        url = json.loads(r.stdout[r.stdout.index("["):])[0]["result_url"]
        urllib.request.urlretrieve(url, dest + ".parcial")
        shutil.copy(dest, copia); os.replace(dest + ".parcial", dest)
        return n, "ok"
    except Exception:
        return n, "FALLA: " + (r.stderr or r.stdout)[-200:].replace("\n", " ")

if __name__ == "__main__":
    with ThreadPoolExecutor(2) as ex:
        for n, e in ex.map(correr, sys.argv[1:] or list(IMAGENES)): print(n, e, flush=True)
