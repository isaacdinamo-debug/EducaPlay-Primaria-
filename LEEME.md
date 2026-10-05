# Educaplay Primaria · prototipo con diseño (v2)

Rediseño de las tres zonas del prototipo navegable (Descubrir, Proyectar, Acompañar)
con el sistema visual de Kapi. Parte de `Necesidades_diseno_prototipo_Educaplay_Primaria.md`.

## Cómo verlo

Abrir `index.html` en el navegador. No necesita servidor ni conexión: las fuentes,
los videos de Kapi y los íconos están en esta carpeta.

`#/equipo` es una página interna con los tres recorridos y el botón para reiniciar
el avance. No figura en la navegación.

## Qué hay en la carpeta

| Archivo | Qué es |
|---|---|
| `index.html` | La página. Carga los estilos y los cinco scripts. |
| `estilos.css` | El sistema visual: tokens, componentes y las tres zonas. |
| `actividades.css` | Maquetación de las actividades, heredada del prototipo y repintada. |
| `js/arte.js` | Marca, íconos, glifos, banda de los Esteros y mapas. |
| `js/datos.js` | Datos de demostración del prototipo original. |
| `js/actividades.js` | Las actividades de los módulos, sin cambios de lógica. |
| `js/vistas.js` | Las pantallas de las tres zonas. |
| `js/app.js` | Rutas, eventos, ventanas y avance guardado. |
| `kapi/`, `fuentes/` | Recursos aprobados de Kapi y tipografías, copiados de `kapi-app`. |

## El arte

Flat design minimalista con el contorno castaño de Kapi, todo autóctono de Corrientes
y siempre sobre terreno plano (en Corrientes no hay lomas). Se generó con la CLI de
Higgsfield; los pedidos están en `herramientas/generar_arte.py`.

| Carpeta | Qué hay |
|---|---|
| `arte/originales/v3/` | Las imágenes tal como salieron (PNG, 2K). No las carga la página. |
| `arte/*.webp` | Bienvenida (Esteros), los dos mapas, los dos fondos de actividad, aula y galería. |
| `arte/lugares/`, `hallazgos/`, `companeros/`, `animales/`, `tarjetas/`, `verbos/` | Insignias redondas de 512 px, cortadas con `herramientas/cortar_lamina.py`. |
| `arte/objetos/` | Pitanga, pichón de hornero en su nido, ficha de pasajero y lancha, con transparencia (`herramientas/cortar_sueltos.py`). |
| `arte/kapi/` | Kapi de cuerpo entero en seis poses. El reposo sale del original de 1080×1440; las otras cinco, de una lámina generada con ese original como referencia. |
| `arte/marca/` | El wordmark oficial de Educaplay (el mismo archivo que usa Secundaria) y el ícono de pestaña, que es su "E". |

Las herramientas de corte necesitan Python con Pillow, NumPy y SciPy.
`node herramientas/probar_vistas.js` renderiza las 72 pantallas y avisa si falta una imagen o queda un emoji.

## Animación

- `arte/esteros.mp4`: la bienvenida en bucle (Seedance 2.5).
- `arte/companeros-video/`: los seis compañeros de 2.° (Yrupé, Mbyja, Yvytu, Tataendy, Yvy, Ñasaindy) y los personajes de 1.° del universo (Itá, Arandu, Yvoty, Jasy), en tres gestos cada uno: 30 clips. Los de 1.° viven en su lugar del mapa y saludan cuando se lo toca; Itá acompaña «Entre los esteros». Se generan con `herramientas/generar_clips.py` se empaquetan con `herramientas/empaquetar_clips.sh` (que ancla el principio y el final de cada clip al dibujo base (`arte/originales/v3/base-*.png`) para que el bucle y el cambio de gesto no salten) y se les quita el fondo con `herramientas/clips_sin_fondo.py`. La página usa sólo los `.webm` sin fondo; los `.mp4` intermedios no se guardan.
- `arte/botones/` y `arte/secciones/`: botonera ilustrada e ilustración de cada sección de Proyectar y Acompañar.
- El resto del movimiento está en `estilos.css`, en la sección «Vida». Con "reducir movimiento" activado en el dispositivo, todo queda quieto.

## Reemplazos de contenido, para que los revise el equipo

Se cambiaron objetos y nombres por otros de Corrientes. La consigna y lo que se enseña no cambian.

| Antes | Ahora | Dónde |
|---|---|---|
| Frutos rojos genéricos | Pitangas | Los frutos del monte |
| Pichones genéricos | Pichones de hornero en su nido de barro | Un fruto para cada pichón |
| Pez | Sábalo | Entre los esteros |
| Pato | Pato sirirí | Entre los esteros; Peces y aves |
| Cisne | Garza | Peces y aves |
| Sandía $20, pan $10, caramelos $5 | Miel $20, chipá $10, naranja $5 | La feria de la costanera |
| "¿Podés comprar dos panes de $10?" | "¿Podés comprar dos chipás de $10?" | La feria de la costanera |
| Globo de la feria (hallazgo) | Acordeón de chamamé | Cuaderno de campo |
| Ancla (ícono del puerto) | Lancha de pasajeros | Mapa de 2.° |
| Compañeros con nombre de animal | Nombre guaraní del universo de Kapi: Yrupé, Mbyja, Yvytu, Tataendy, Yvy, Ñasaindy | Elegir compañero |

## Pendiente

- El guía de 2.° es Tataendy y el mundo pasó a llamarse «El Río de Tataendy». En «Los frutos del monte» (1.°) también acompaña Tataendy, aunque el universo lo ubica en 2.°: a revisar con contenidos.
- El dado sigue dibujado en código (sus puntos cambian en cada tirada).
- Los videos de Kapi siguen en 540×720; los originales sin comprimir no están en la carpeta.
- Los logos institucionales van en texto.
- Los textos de «Qué pasa si…» y «Para el cuaderno» son de demostración.
- No se hizo: estado de espera con el personaje, control de tamaño de texto.
- La versión impresa no se revisó en papel. El ancho de celular no se pudo comprobar en pantalla.
- La versión publicada en Netlify es la anterior; esta no está publicada.
- El movimiento no se revisó en pantalla: sólo se vieron capturas fijas.
