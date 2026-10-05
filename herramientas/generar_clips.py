"""Anima a los seis compañeros con la CLI de Higgsfield, con el mismo
método que los videos de Kapi (kapi-app/scripts/loops-kapi/README.md):
Seedance 2.5, 5 s, 3:4, 720p, sin audio, y el cuadro base del personaje
como primer y último cuadro, para que el bucle cierre.

    python3 herramientas/generar_clips.py                 # todo lo que falte
    python3 herramientas/generar_clips.py garza-saluda    # sólo esos clips

Deja cada clip en arte/originales/video/<personaje>-<gesto>.mp4. Si el
archivo ya existe no se vuelve a generar (para rehacer uno, borrarlo).
Cada clip cuesta 35 créditos.
"""
import json, subprocess, sys, os, urllib.request
from concurrent.futures import ThreadPoolExecutor

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASES = os.path.join(RAIZ, "arte/originales/v3")
SALIDA = os.path.join(RAIZ, "arte/originales/video")

ESTILO = ("Traditional 2D hand-drawn character animation of the flat vector cartoon character in the reference frame. The drawing "
    "style, line weight, colors and proportions stay exactly identical to the reference frame at every moment. The camera is "
    "completely locked: no zoom, no pan, no parallax. The cream paper background, the sandy ground and the grass tufts stay "
    "completely still. Bright even daylight, no lighting change, no added text, no added objects, no morphing, no style drift. "
    "ACTION: %s The first and last frame are the exact resting pose of the reference frame.")

# Cada animal saluda y festeja con lo que tiene: alas, cola, cabeza.
GESTOS = {
  "garza": dict(
    reposo="The egret breathes calmly twice, blinks once and tilts its head slightly.",
    saluda="In the first two seconds the egret lifts one wing and waves it twice like saying hello, smiling, then folds the wing back.",
    festeja="In the first two seconds the egret opens both wings wide and does two happy little hops, eyes closed with joy, then lands and folds its wings."),
  "yarara": dict(
    reposo="The little snake breathes calmly twice, blinks once and sways its head very slightly.",
    saluda="In the first two seconds the little snake lifts the tip of its tail and waves it twice like saying hello, smiling, then lowers it.",
    festeja="In the first two seconds the little snake stretches its neck up tall and wiggles happily from side to side twice, eyes closed with joy, then settles back."),
  "caraya": dict(
    reposo="The monkey breathes calmly twice, blinks once and its tail sways slightly.",
    saluda="In the first two seconds the monkey raises its right arm and waves twice like saying hello, smiling, then lowers the arm.",
    festeja="In the first two seconds the monkey jumps with both arms up twice, eyes closed and mouth open with joy, then lands."),
  "guacamayo": dict(
    reposo="The macaw breathes calmly twice, blinks once and tilts its head slightly.",
    saluda="In the first two seconds the macaw lifts one wing and waves it twice like saying hello, then folds the wing back.",
    festeja="In the first two seconds the macaw flaps both wings and does two happy little hops, eyes closed with joy, then lands and folds its wings."),
  "tortuga": dict(
    reposo="The turtle breathes calmly twice and blinks once slowly.",
    saluda="In the first two seconds the turtle raises its right arm and waves twice like saying hello, smiling, then lowers the arm.",
    festeja="In the first two seconds the turtle raises both arms and does two small happy hops, eyes closed with joy, then lands."),
  "yabiru": dict(
    reposo="The stork breathes calmly twice, blinks once and tilts its head slightly.",
    saluda="In the first two seconds the stork lifts one wing and waves it twice like saying hello, then folds the wing back.",
    festeja="In the first two seconds the stork opens both wings wide and does two happy little hops, eyes closed with joy, then lands and folds its wings."),

  # personajes de 1.° grado
  "ita": dict(
    reposo="The young caiman breathes calmly twice, blinks once slowly and its tail sways slightly on the ground.",
    saluda="In the first two seconds the young caiman raises its right arm and waves twice like saying hello, smiling, then lowers the arm.",
    festeja="In the first two seconds the young caiman claps its hands and does two small happy hops, eyes closed with joy, tail swinging, then lands."),
  "arandu": dict(
    reposo="The young jaguar breathes calmly twice, blinks once slowly and the tip of its tail curls slightly.",
    saluda="In the first two seconds the young jaguar raises its right paw and waves twice like saying hello, with a gentle smile, then lowers the paw.",
    festeja="In the first two seconds the young jaguar raises both paws and does two happy little hops, eyes closed with joy, then lands."),
  "yvoty": dict(
    reposo="The young deer breathes calmly twice, blinks once and twitches one ear.",
    saluda="In the first two seconds the young deer raises its right front leg and waves it twice like saying hello, smiling, then lowers it.",
    festeja="In the first two seconds the young deer does two happy little bounces with all four legs, ears up, eyes closed with joy, then lands."),
  "jasy": dict(
    reposo="The maned wolf breathes calmly twice, blinks once and its big ears twitch slightly.",
    saluda="In the first two seconds the maned wolf lifts one front paw and waves it twice like saying hello, tail wagging, then puts the paw down.",
    festeja="In the first two seconds the maned wolf does two happy little bounces on its long legs, tail wagging, eyes closed with joy, then lands."),
}

def correr(clave):
    quien, gesto = clave.split("-")
    destino = os.path.join(SALIDA, clave + ".mp4")
    if os.path.exists(destino): return clave, "ya estaba"
    base = os.path.join(BASES, f"base-{quien}.png")
    cmd = ["higgsfield", "generate", "create", "seedance_2_5", "--mode", "omni_reference", "--duration", "5", "--resolution", "720p",
           "--aspect_ratio", "3:4", "--generate_audio", "false", "--start-image", base, "--end-image", base,
           "--prompt", ESTILO % GESTOS[quien][gesto], "--wait", "--wait-timeout", "25m", "--json"]
    for intento in range(2):
        r = subprocess.run(cmd, capture_output=True, text=True)
        try:
            url = json.loads(r.stdout[r.stdout.index("["):])[0]["result_url"]
            urllib.request.urlretrieve(url, destino + ".parcial"); os.replace(destino + ".parcial", destino)
            return clave, "ok"
        except Exception:
            error = (r.stderr or r.stdout)[-240:].replace("\n", " ")
            # sólo se reintenta si el pedido no llegó a crearse (error de subida o del servicio)
            if not any(c in error for c in ("520", "503", "502", "PUT media")): break
    return clave, "FALLA: " + error

if __name__ == "__main__":
    os.makedirs(SALIDA, exist_ok=True)
    claves = sys.argv[1:] or [f"{q}-{g}" for q in GESTOS for g in GESTOS[q]]
    with ThreadPoolExecutor(int(os.environ.get("A_LA_VEZ", 2))) as ex:
        for c, estado in ex.map(correr, claves): print(c, estado, flush=True)
