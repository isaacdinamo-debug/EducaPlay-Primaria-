"""Genera el arte flat correntino con la CLI de Higgsfield.

    python3 herramientas/generar_arte.py            # todo lo que falte
    python3 herramientas/generar_arte.py mapa-kapi  # sólo esos trabajos

Cada trabajo deja su PNG en arte/originales/v3/<nombre>.png. Si el archivo
ya existe no se vuelve a generar (para rehacer uno, borrarlo).
"""
import json, subprocess, sys, os, urllib.request
from concurrent.futures import ThreadPoolExecutor

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, "arte/originales/v3")
BASE = os.path.join(RAIZ, "../kapi-app/scripts/loops-kapi/kapi-frame-base.png")   # Kapi en reposo
ESCENA = os.path.join(SALIDA, "esteros.png")                    # paisaje aprobado
LAMINA = os.path.join(SALIDA, "lugares.png")                      # insignias aprobadas

ESTILO = (
    "MINIMALIST FLAT DESIGN illustration for a young children's app (ages 6-7). Use the reference images ONLY for "
    "drawing style: perfectly flat solid color fills, one uniform dark brown outline (#2b1607) of constant thickness "
    "around every shape, big simple rounded shapes built from very few forms. STRICT RULES: NO texture, NO paper grain, "
    "NO shading, NO shadows, NO gradients, NO highlights, NO tiny details, NO realism. Few elements and lots of calm "
    "empty space. Everything shown is native to the province of Corrientes, Argentina. The land of Corrientes is "
    "completely FLAT: never draw hills, slopes or mountains; any horizon is a straight flat line. "
    "PALETTE ONLY: cream #fbf3df, teal #8fc4c4, pale teal #cbe6e2, greens #a9c187 #84ad63 #6c8f4c, sand #e6d3ae, "
    "yellow #efbb3f, pink #f3a6c0, warm red #c8412f, browns #8a5a34 #9c6435, outline #2b1607. "
    "No text, no letters, no numbers, no labels, no frame or border. Do NOT draw the capybara from the reference unless asked.\n\n"
)
OJOS = ("Every animal has the SAME EYES as the reference character: large round dark brown eyes with a white ring and one "
        "small white highlight, and a small friendly smile, even the birds, fish and reptiles. ")

def insignias(col, fil, relleno, que):
    return (f"A sheet of exactly {col*fil} round sticker badges on a plain pure white background, in a strict even grid of "
            f"{col} columns and {fil} rows, evenly spaced, all exactly the same size, never touching. Each badge is a perfect "
            f"circle with {relleno} and one dark brown outline, holding ONE subject centered with comfortable margin.\n" + que)

T = {}
T["mapa-kapi"] = dict(ar="3:2", refs=[BASE, ESCENA], p=ESTILO +
    "SUBJECT: a storybook adventure MAP of the Iberá wetlands seen straight from above, filling the whole frame edge to edge. "
    "No sky, no horizon, no sun. The ground is one flat light green (#a9c187) with a few flat sand patches.\n"
    "FIVE AREAS spread wide apart, each with a big EMPTY round sand clearing where a button will sit, connected by ONE winding "
    "pale sand footpath with a few brown paw prints, going left to right:\n"
    "1) BOTTOM LEFT, the monte: a small group of round green trees, some with red pitanga fruits.\n"
    "2) UPPER LEFT-CENTER, the estero: a small teal pond with brown cattails (totoras).\n"
    "3) CENTER, a little below the middle: a round teal lagoon with three green camalote pads and one irupé pad with a white flower.\n"
    "4) UPPER RIGHT, the community: three small ranchos exactly like the hut in the reference (cream walls, straw roof, brown door) and one pink lapacho tree.\n"
    "5) FAR RIGHT, lower: open grass with two yatay palm trees and one blank wooden signpost.\n"
    "Very few extra elements: a handful of small round bushes. Keep it simple and uncluttered.")
T["mapa-aguara"] = dict(ar="3:2", refs=[BASE, ESCENA], p=ESTILO +
    "SUBJECT: a storybook adventure MAP of the riverside of the city of Corrientes on the Paraná river, seen straight from above, "
    "filling the whole frame edge to edge. No sky, no horizon, no sun.\n"
    "LAYOUT: the upper two thirds of the picture is flat light green LAND. The lower third is one wide flat teal RIVER running "
    "horizontally, with a flat pale sand beach all along its upper bank. Nothing except boats, the island and the bridge may be on the water.\n"
    "On the LAND there are FIVE big EMPTY round sand clearings (plain circles, nothing inside), spread wide apart, joined by pale sand "
    "footpaths with a few brown paw prints. Next to each clearing stands ONE landmark, all on land:\n"
    "1) FAR LEFT clearing, near the river: a short wooden pier going into the water with two small passenger boats (lanchas) with a canopy roof.\n"
    "2) UPPER LEFT clearing: a small cream colonial post office with a brown door, a red mailbox beside it, and a completely blank sign.\n"
    "3) CENTER clearing, on the sand beach by the river: a rowing boat pulled up on the sand.\n"
    "4) UPPER RIGHT-CENTER clearing, the feria franca: three market stalls on the grass with red-and-cream striped awnings, showing oranges and baskets.\n"
    "5) FAR RIGHT clearing, near the river: a small sand island in the river just offshore with two yatay palm trees.\n"
    "At the FAR RIGHT, the General Belgrano Bridge crosses the river from the land to the bottom edge: a CABLE-STAYED bridge with a flat "
    "light grey concrete deck and exactly TWO tall light grey concrete pylons shaped like a narrow letter A, each with a few straight "
    "diagonal cables fanning from the top of the pylon down to the deck. It is NOT a suspension bridge: no curved hanging cables, no brown color.\n"
    "Three pink lapacho trees along a simple riverside promenade. Very few extra elements. Simple and uncluttered.")
T["fondo-monte"] = dict(ar="16:9", refs=[BASE, ESCENA], p=ESTILO +
    "SUBJECT: an EMPTY stage background for a game, a clearing in the monte of Corrientes.\n"
    "COMPOSITION: the upper half is plain flat cream sky with two tiny simple clouds. A perfectly straight flat horizon line. "
    "The lower half is one flat light green ground (#a9c187) with only four tiny grass marks. At the far LEFT edge only, one simple "
    "round green tree. At the far RIGHT edge only, one pink lapacho tree like in the reference. Both trees are narrow and stay within "
    "the outer 12% of the picture. The whole center is completely empty.")
T["fondo-rio"] = dict(ar="16:9", refs=[BASE, ESCENA], p=ESTILO +
    "SUBJECT: an EMPTY stage background for a game, the bank of the Paraná river in Corrientes.\n"
    "COMPOSITION: the upper 45% is plain flat cream sky with two tiny simple clouds. A perfectly straight flat horizon with one thin "
    "flat green strip (the far shore). Below it a wide flat teal river with five short pale ripple lines. At the very bottom a flat "
    "strip of pale sand. At the far LEFT edge only, one yatay palm tree. At the far RIGHT edge only, a short wooden pier with two posts. "
    "Both stay within the outer 12% of the picture. The whole center is completely empty.")
T["aula"] = dict(ar="16:9", refs=[BASE, ESCENA], p=ESTILO +
    "SUBJECT: a teacher's desk in a small rural school of Corrientes. Very simple.\n"
    "COMPOSITION: the left 40% of the picture is a plain flat cream wall, completely empty. On the right: a simple wooden desk with an "
    "open notebook with blank pages, a cup with three colored pencils and a tablet standing up with a blank cream screen. Behind it a "
    "big open window showing the flat wetland exactly like the reference landscape (teal water, flat straight horizon, one pink lapacho "
    "tree). Next to the window a green chalkboard with three simple chalk paw prints.")
T["galeria"] = dict(ar="16:9", refs=[BASE, ESCENA], p=ESTILO +
    "SUBJECT: the porch (galería) of a rancho in the countryside of Corrientes. Very simple.\n"
    "COMPOSITION: the left 40% of the picture is the plain flat cream wall of the rancho with one small wooden window, otherwise empty. "
    "On the right, under a straw roof edge held by one wooden post: a simple wooden table with a mate gourd with its metal straw, a "
    "thermos, a plate with three ring-shaped chipá breads and an open notebook with two crayons; one simple wooden chair; a child's "
    "backpack on the floor. Beyond: flat green plain with a perfectly straight horizon, one yatay palm, a strip of teal water and plain cream sky.")
T["companeros"] = dict(ar="3:2", refs=[BASE, LAMINA], p=ESTILO + OJOS + insignias(3, 2, "a flat pastel fill",
    "Each subject is a cute animal of the Iberá wetlands shown as a simple bust facing the viewer.\n"
    "Top row, left to right: (1) white egret (garza blanca) with a yellow beak, on pale teal; (2) a small friendly yarará snake, "
    "tan with simple brown diamond marks, curled up, on pale sand; (3) black howler monkey (carayá), dark brown with a tan face, on pale green.\n"
    "Bottom row, left to right: (4) red-and-green macaw (guacamayo rojo), red with a cream curved beak, on pale yellow; (5) green river "
    "turtle, on pale pink; (6) jabiru stork (yabirú): white body, black head and neck, red collar band, long dark beak, on pale lilac."))
T["lugares"] = dict(ar="16:9", refs=[BASE, LAMINA], p=ESTILO + insignias(5, 2, "a flat warm cream fill (#fbf3df)",
    "Top row, left to right: (1) a red macaw perched on a branch with two red pitanga fruits; (2) two brown cattails (totoras) "
    "with green leaves; (3) the head of a friendly green yacaré caiman peeking out of flat teal water; (4) a rancho hut with cream "
    "walls, straw roof and brown door, like the reference landscape; (5) a winding sand path with three brown paw prints and one small palm.\n"
    "Bottom row, left to right: (6) a small river passenger boat (lancha) with a canopy roof on flat teal water; (7) a cream envelope "
    "with a small red stamp; (8) a golden dorado fish; (9) a market stall with a red-and-cream striped awning and three oranges; "
    "(10) a tiny sand island with one yatay palm in flat teal water."))
T["hallazgos"] = dict(ar="16:9", refs=[BASE, LAMINA], p=ESTILO + insignias(4, 2, "a flat warm cream fill and a thick flat yellow rim (#efbb3f)",
    "Each badge is a collectible explorer's medal.\n"
    "Top row, left to right: (1) one red macaw feather; (2) one brown paw print with four toes; (3) a lilac camalote flower on a green "
    "pad; (4) a woven wicker basket with a handle.\n"
    "Bottom row, left to right: (5) a brass anchor; (6) a postage stamp with scalloped edges showing a tiny flat teal river; "
    "(7) one golden fish scale; (8) a small red-and-cream chamamé accordion."))
T["animales"] = dict(ar="3:2", refs=[BASE, LAMINA], p=ESTILO + OJOS + insignias(4, 3, "a flat warm cream fill (#fbf3df)",
    "Each subject is a whole animal of Corrientes in a simple side view, drawn like a child's sticker: a body made of ONE flat color "
    "plus at most two flat accent colors. ABSOLUTELY NO scales, NO fish-scale pattern, NO feather lines, NO fur strokes, NO shine, "
    "NO color blending, NO realism. All twelve animals share exactly the same simple cartoon style and the same big eyes.\n"
    "Row 1, left to right: (1) sábalo fish: plain flat light grey round body; (2) dorado fish: plain flat golden yellow body with a flat "
    "orange tail and fins; (3) palometa fish: very round flat light grey body with a flat red-orange belly patch; (4) boga fish: long "
    "slim plain flat grey body with three flat dark dots.\n"
    "Row 2, left to right: (5) sirirí duck: flat brown body with a flat white face; (6) white egret (garza blanca): flat white body, "
    "flat yellow beak; (7) hornero bird: small, flat rufous brown; (8) red-and-green macaw (guacamayo rojo): flat red with a flat blue and yellow wing.\n"
    "Row 3, left to right: (9) green river turtle; (10) black howler monkey (carayá) sitting, flat dark brown with a tan face; "
    "(11) yaguareté jaguar sitting: flat yellow with a few simple flat dark dots; (12) green yacaré caiman, whole body, side view."))
T["tarjetas"] = dict(ar="16:9", refs=[BASE, LAMINA], p=ESTILO + insignias(5, 3, "a flat warm cream fill (#fbf3df)",
    "Row 1, left to right: (1) a yellow sun rising over flat teal water with a straight horizon; (2) a green yacaré head peeking out "
    "of the water between two green camalote pads; (3) the capybara from the reference and a green yacaré lying side by side on sand under "
    "a small sun; (4) three simple teal water waves; (5) one round green tree.\n"
    "Row 2, left to right: (6) a small rural school: cream building, red roof, brown door and a flagpole with a light-blue-white-light-blue "
    "flag; (7) a small general store with a striped awning and a wooden crate; (8) a town plaza: one bench, one pink lapacho tree and one "
    "lamppost; (9) a waving paw; (10) an open envelope with a red heart coming out.\n"
    "Row 3, left to right: (11) two paws hugging a red heart; (12) a pencil drawing a wavy signature line; (13) one orange with a green "
    "leaf; (14) three ring-shaped chipá breads on a plate; (15) a glass jar of golden honey."))
T["verbos"] = dict(ar="3:2", refs=[BASE, LAMINA], p=ESTILO + insignias(3, 2, "a flat pastel fill",
    "Top row, left to right: (1) a magnifying glass over a paw print, on pale teal; (2) a glowing yellow light bulb, on pale lilac; "
    "(3) a paintbrush and a pencil crossed, on pale yellow.\n"
    "Bottom row, left to right: (4) two speech bubbles, on pale orange; (5) two paws doing a high five, on pale green; "
    "(6) a small backpack with a key hanging from it, on pale sand."))
T["objetos"] = dict(modelo="gpt_image_2_5", ar="16:9", refs=[BASE, ESCENA], extra=["--background", "transparent", "--quality", "high", "--resolution", "2k"], p=ESTILO +
    "A sheet of exactly 4 separate objects on a fully TRANSPARENT background, in one row, evenly spaced, never touching, each with generous "
    "empty space around it.\nLeft to right: (1) one red pitanga fruit: a round ribbed red berry with one green leaf; (2) a hornero bird "
    "chick peeking out of its round mud nest (a brown clay oven-shaped nest with a side opening), the chick small, rufous brown, with the "
    "same big round eyes as the reference character; (3) a round passenger token: a cream circle with a simple straw hat on it; "
    "(4) a small river passenger boat (lancha) in side view: red hull with a cream stripe, a cream cabin with two teal windows and a canopy roof.")
T["companeros"]["p"] = T["companeros"]["p"] + (
    "\nIMPORTANT: the egret and the jabiru stork must NOT have small realistic bird eyes: give them the same very large round cartoon "
    "eyes as the monkey, the snake, the macaw and the turtle.")
T["galeria"]["p"] = T["galeria"]["p"] + (
    "\nThe chipá are plain small cheese breads: flat pale golden-beige rings, matte, with NO glaze, NO icing, NO sprinkles, NO orange "
    "or pink color. They must not look like donuts.")
T["kapi-poses"] = dict(modelo="seedream_v5_pro", ar="21:9", refs=[BASE], p=
    "Character sheet of the EXACT capybara character in the reference image, drawn five times in a single row on the same plain flat "
    "cream background, evenly spaced, never touching, full body, same size. The character must be IDENTICAL to the reference in every "
    "pose: same head shape, same round ears, same big eyes, same brown muzzle, same orange fur color, same olive green satchel with its "
    "strap, same uniform dark brown outline, same flat colors. No ground, no grass, no shadows, no text.\n"
    "Poses, left to right: (1) waving hello with the right arm raised, smiling with mouth open; (2) pointing to the right with one arm; "
    "(3) jumping with both arms up, eyes closed, laughing; (4) thinking, one paw on the chin, looking up; (5) giving a thumbs up with a small nod.")

# ---------------------------------------------------------------------------
# Los seis compañeros de cuerpo entero. Cada imagen es el "cuadro base" que
# después se anima: mismo encuadre y mismo papel que el cuadro base de Kapi.
# ---------------------------------------------------------------------------
BUSTOS = os.path.join(SALIDA, "companeros.png")
def cuadro_base(quien):
    return ("A NEW CHARACTER for the same children's animated series as the capybara in the first reference image. Copy that "
        "image's drawing style, framing and background EXACTLY: perfectly flat solid color fills, one uniform dark brown "
        "outline (#2b1607) of constant thickness, big simple rounded shapes, chubby friendly toddler-like proportions, and the "
        "SAME EYES: large round dark brown eyes with a white ring and one small white highlight, plus small curved eyebrows and "
        "a small friendly smile. The character stands upright facing the viewer in a relaxed resting pose, full body, centered, "
        "filling about 58% of the frame height, on the same plain flat warm cream paper background, standing on the same small "
        "flat sand-colored oval ground patch with two small flat grass tufts. NO texture, NO shading, NO gradients, NO feather "
        "lines, NO fur strokes, NO scales, NO realism. No satchel, no clothes, no accessories. No text. Do NOT draw a capybara.\n"
        "The second reference image only shows which animals belong to this series.\n\nTHE CHARACTER: " + quien)
PERSONAJES = {
    "garza":     "Yrupé, a white egret (garza blanca) of the Iberá wetlands: round white body, long gently curved white neck, round white "
                 "head with three small crest feathers, straight yellow beak, two long thin dark legs with simple feet, small folded wings.",
    "yarara":    "Mbyja, a small friendly yarará snake: body coiled in two round loops on the ground with the head raised upright in front, "
                 "flat tan color with a few simple flat brown diamond marks, rounded head, no fangs, no tongue.",
    "caraya":    "Yvytu, a young black howler monkey (carayá): flat dark brown-black body, round head with a flat tan face, round ears, "
                 "long curled tail, arms relaxed at the sides.",
    "guacamayo": "Tataendy, a red-and-green macaw (guacamayo rojo): round flat red body and head, cream curved beak with a dark tip, white "
                 "face patch around the eyes, folded wings with one flat blue band and one flat yellow band, short red tail, two small grey feet.",
    "tortuga":   "Yvy, a young river turtle standing upright on its two back legs like a cartoon: round flat green head, short arms, a "
                 "flat olive green rounded shell on its back with three simple plates, pale yellow-green belly.",
    "yabiru":    "Ñasaindy, a jabiru stork (yabirú): round white body, flat black neck and round black head, a flat red collar band at "
                 "the base of the neck, long straight dark beak, two long thin dark legs with simple feet, small folded white wings.",
}
for _n, _q in PERSONAJES.items():
    T["base-" + _n] = dict(modelo="seedream_v5_pro", ar="3:4", refs=[BASE, BUSTOS], p=cuadro_base(_q))

T["botones"] = dict(modelo="gpt_image_2_5", ar="21:9", refs=[BASE, ESCENA], extra=["--background", "transparent", "--quality", "high", "--resolution", "2k"], p=ESTILO +
    "A sheet of exactly 8 separate button icons on a fully TRANSPARENT background, in ONE single row, evenly spaced, never touching, "
    "all the same height, each with generous empty space around it. Each icon is a chunky friendly object, like a toy.\n"
    "Left to right: (1) a wooden arrow signpost pointing LEFT with one brown paw print on it; (2) a rolled-out cream paper map with a "
    "dotted path and a red mark; (3) an explorer's field notebook with an olive green cover, a brown strap and a paw print on the cover; "
    "(4) a small rancho hut with cream walls, straw roof and brown door; (5) a teal loudspeaker cone with three curved sound waves; "
    "(6) a wooden arrow signpost pointing RIGHT with one brown paw print on it; (7) a round olive green badge with a cream play triangle; "
    "(8) a round brown badge with a cream X made of two crossed sticks.")

T["secciones"] = dict(ar="16:9", refs=[BASE, LAMINA], p=ESTILO + insignias(4, 2, "a flat pastel fill",
    "Row 1, left to right: (1) an open guide book with a compass lying on it, on pale teal; (2) three colored paper tags hanging from a "
    "branch with a pink lapacho flower, on pale lilac; (3) a blank wooden signpost at a fork of two sand paths, on pale yellow; (4) a "
    "rancho hut with a pink lapacho tree beside it under a small sun, on pale green.\n"
    "Row 2, left to right: (5) a mate gourd with its metal straw next to an open notebook with two crayons, on pale orange; (6) a tablet "
    "standing on a wooden table next to a small potted plant, on pale teal; (7) two speech bubbles, one with a paw print inside, on pale "
    "sand; (8) a wicker basket with wooden blocks and three red pitanga fruits, on pale pink."))


T["juego-monte"] = dict(modelo="gpt_image_2_5", ar="16:9", refs=[BASE, ESCENA], extra=["--background", "transparent", "--quality", "high", "--resolution", "2k"], p=ESTILO +
    "A sheet of exactly 2 separate objects on a fully TRANSPARENT background, side by side, never touching, with generous empty space around each.\n"
    "LEFT: a pitanga tree of the monte of Corrientes, front view: one short straight brown trunk and ONE big round bushy canopy made of three "
    "overlapping flat green circles, the canopy filling the top two thirds of the tree. The canopy is completely EMPTY: no fruits, no flowers, "
    "no leaves drawn individually, no birds. A tiny flat grass tuft at the base of the trunk.\n"
    "RIGHT: a wide, low, empty woven wicker basket seen from the front, flat honey-brown with a simple crossed weave pattern drawn with a few "
    "lines, a thick rounded rim, and NO handle. The basket is wider than tall (about 3 wide by 2 tall) and completely empty.")

# Los personajes de 1.° grado del universo ("El mundo de Kapi").
PERSONAJES_1 = {
    "ita":    "Itá, a young yacaré caiman standing upright on its two back legs like a cartoon: flat green body, a long rounded snout "
              "with a calm closed smile, a few simple flat bumps along the back and the long tail resting on the ground, pale yellow-green belly.",
    "arandu": "Arandu, a young yaguareté (jaguar) standing upright, calm and noble like a gentle guardian, not scary: flat warm yellow fur "
              "with a few simple flat dark rosette spots, round ears, pale cream muzzle and belly, long tail with a dark tip.",
    "yvoty":  "Yvoty, a young marsh deer (ciervo de los pantanos) standing upright: flat orange-tan fur, big round ears with cream "
              "insides, a dark muzzle, pale cream belly, small simple antlers, long thin legs with dark lower legs.",
    "jasy":   "Jasy, a young aguará guazú (maned wolf) standing upright, curious and attentive: flat reddish-orange fur, very large "
              "upright pointed ears, a black muzzle, long thin black legs, a short black mane on the back of the neck, a white-tipped tail.",
}
for _n, _q in PERSONAJES_1.items():
    T["base-" + _n] = dict(modelo="seedream_v5_pro", ar="3:4", refs=[BASE, BUSTOS], p=cuadro_base(_q))

# Lapacho y palmera caranday bien dibujados: una lámina de referencia, que
# después se usa para corregir cada imagen que los tiene.
T["arboles"] = dict(modelo="seedream_v5_pro", ar="16:9", refs=[BASE, ESCENA], p=ESTILO +
    "A reference sheet of exactly TWO trees of Corrientes side by side on a plain flat warm cream background, each standing on a small "
    "flat sand-colored ground patch, never touching, same height.\n"
    "LEFT: a pink LAPACHO tree (Handroanthus impetiginosus) in full bloom, with NO leaves: a sturdy brown trunk that splits into a few "
    "twisting branches that open upward like a vase, and on the tips of the branches several rounded CLUSTERS of trumpet-shaped pink "
    "flowers, drawn as soft scalloped pink clouds with a few small darker pink flower shapes, letting the branches show between the "
    "clusters. The silhouette is wide, airy and irregular, not three round balls.\n"
    "RIGHT: a CARANDAY palm (Copernicia alba) of the Chaco and Corrientes: a single tall, slender, straight grey-brown trunk with a "
    "simple crisscross pattern of old leaf bases on its lower half, and a compact round crown of FAN-SHAPED (palmate) leaves: each leaf "
    "is a round green fan made of many stiff pointed segments radiating from one point, on a short stalk, about ten fans pointing in all "
    "directions, a few lower ones hanging down and a little drier yellow-green. NOT a coconut palm: no long feathery fronds, no coconuts.")

T["lettering"] = dict(modelo="gpt_image_2_5", ar="21:9", refs=[BASE], extra=["--background", "transparent", "--quality", "high", "--resolution", "2k"], p=
    "A sheet of exactly 5 separate design elements on a fully TRANSPARENT background, in ONE single row, evenly spaced, never touching. "
    "Flat vector style exactly like the reference character: perfectly flat solid colors, one uniform dark brown outline (#2b1607). "
    "NO texture, NO shading, NO gradients, NO glow.\n"
    "Left to right:\n"
    "(1) The single word 'Primaria' (capital P, then lowercase r-i-m-a-r-i-a, exactly eight letters, spelled P-r-i-m-a-r-i-a) in chunky, "
    "rounded, friendly hand-drawn lettering for a children's brand, letters filled with warm cream (#fffaf0) and outlined in thick dark "
    "brown, slightly bouncy baseline, tilted up a few degrees. Nothing else around the word.\n"
    "(2) One wide horizontal paint-brush stroke in flat warm yellow (#efbb3f) with a thin dark brown outline, slightly wavy, with irregular "
    "dry-brush ends, about six times wider than tall.\n"
    "(3) One short hand-drawn underline swoosh in flat teal (#2f8c98), slightly curved.\n"
    "(4) One short hand-drawn underline swoosh in flat olive green (#52633b), slightly curved.\n"
    "(5) One short hand-drawn underline swoosh in flat warm yellow-orange (#d9904b), slightly curved.\n"
    "No other text, no other letters, no frame.")

def correr(nombre):
    t = T[nombre]; destino = os.path.join(SALIDA, nombre + ".png")
    if os.path.exists(destino): return nombre, "ya estaba"
    modelo = t.get("modelo", "seedream_5_0_flash")
    cmd = ["higgsfield", "generate", "create", modelo, "--prompt", t["p"], "--aspect_ratio", t["ar"], "--wait", "--wait-timeout", "15m", "--json"]
    if modelo.startswith("seedream"): cmd += ["--resolution", "2k"]
    cmd += t.get("extra", [])
    for r in t["refs"]: cmd += ["--image", r]
    r = subprocess.run(cmd, capture_output=True, text=True)
    try:
        url = json.loads(r.stdout[r.stdout.index("["):])[0]["result_url"]
        urllib.request.urlretrieve(url, destino + ".parcial"); os.replace(destino + ".parcial", destino)
        return nombre, "ok"
    except Exception as e:
        return nombre, "FALLA: " + (r.stderr or r.stdout)[-300:].replace("\n", " ")

if __name__ == "__main__":
    os.makedirs(SALIDA, exist_ok=True)
    nombres = sys.argv[1:] or list(T)
    with ThreadPoolExecutor(3) as ex:
        for n, estado in ex.map(correr, nombres): print(n, estado, flush=True)
