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
| `index.html` | La página. Carga los estilos, el índice de audios y los scripts de la plataforma. |
| `estilos.css` | El sistema visual: tokens, componentes y las tres zonas. |
| `actividades.css` | Maquetación de las actividades, heredada del prototipo y repintada. |
| `js/arte.js` | Marca, íconos, glifos, banda de los Esteros y mapas. |
| `js/datos.js` | Datos de demostración del prototipo original. |
| `js/actividades.js` | Actividades y utilidades de los módulos. |
| `js/sonido.js` | Reproductor de voces, cola, controles y orientación del recorrido. |
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

## Auditoría de sonido · 16 de octubre de 2026

Producción actual: 203 MP3 locales para 11 personajes, generados por Higgsfield
CLI con el motor ElevenLabs. La integridad de los 203 archivos fue comprobada;
la aprobación auditiva de las voces sigue pendiente.

Alcance: recorrido infantil de los dos mundos, sus ocho módulos, selección de
compañero, mapa, pistas, cierre, cuaderno y propuesta para casa. Es una auditoría
funcional del audio, no una certificación de accesibilidad de toda la plataforma.

| Hallazgo | Cambio aplicado | Verificación / límite |
|---|---|---|
| El apagado heredado anulaba el nuevo valor por defecto. | La migración `vozVersion:1` enciende la voz una vez. Las elecciones posteriores se conservan. | Pruebas de carga sin datos, datos antiguos y silencio elegido en la nueva versión; recarga en Chrome. |
| Había orientación oral en las actividades, pero faltaba en los pasos previos. | Guía al comenzar, elegir entrada, compañero, mundo y lugar del mapa. | Los mensajes tienen texto visible y controles de repetición y detención; se comprobó el área táctil de 44 px en la bienvenida a 390 px de ancho. |
| Todos hablaban con la misma síntesis del dispositivo. | Reparto estable por personaje; archivos MP3 generados en Higgsfield, motor ElevenLabs, servidos localmente. | Voces de trabajo: falta validación auditiva del acento regional y los nombres guaraníes. El catálogo conserva voz, texto y trabajo de origen. |
| Los festejos eran principalmente visuales. | El compañero elegido interviene tras el mensaje de logro y al terminar la aventura. | La cola reproduce una intervención por vez. Cambiar de pantalla o silenciar cancela lo pendiente. |
| Repetir la consigna leía la última devolución. | La consigna original se conserva aparte del último mensaje. | El pie repite la consigna; “Repetir voz” repite el último mensaje, y tocar al guía vuelve a ofrecer la pista. |
| El saludo del compañero podía quedar cortado por la navegación. | Se reproduce al entrar a la siguiente pantalla, antes de su orientación. | No depende de que el audio dure lo mismo que la animación. |
| Las voces podían seguir tras salir del contexto. | Detención al navegar, cerrar ventanas, ocultar la pestaña o apagar voz. | Pruebas de cola e invalidación de callbacks antiguos. No se reinicia sonido al volver a la pestaña. |
| Los fallos del sintetizador se ocultaban. | Respaldo en español y aviso visual si el audio no se puede reproducir. | La interfaz mantiene el texto aunque no haya soporte de síntesis. Los audios producidos son la primera opción. |
| El volumen dependía de cada voz. | Exportación mono de 44,1 kHz/128 kbps; normalización en dos pasadas a −18 LUFS, pico objetivo −1,5 dBTP. | Verificación de integridad por FFprobe. Falta escuchar en auriculares, parlantes y dispositivos móviles. |

### Qué queda por validar

1. **Escucha editorial y pedagógica:** aprobar timbres, acento correntino/rioplatense,
   pronunciación de Kapi, Tataendy, Yrupé, Mbyja, Yvytu, Yvy y Ñasaindy, pausas y
   energía de los festejos. Las voces elegidas son propuestas revisables. La voz Cody falló en la
   producción y se reemplazó por Archie para Yvytu; los trabajos anteriores
   quedan registrados en el catálogo.
2. **Dispositivos y ayudas técnicas:** probar Android/Chrome, iPhone/iPad/Safari y
   lectores de pantalla (NVDA y VoiceOver). La voz del juego se puede silenciar
   para usar el lector sin dos narraciones simultáneas. No se hizo esa prueba aún.
3. **Acceso a los ejercicios sin visión:** escuchar consignas no reemplaza una
   alternativa pedagógica a contar puntos, comparar colecciones, ubicar elementos
   o arrastrarlos. Revisar nombres accesibles, navegación de opciones, destinos y
   descripción de estado junto a contenidos; no dar respuestas por accidente.
4. **Lectura previa a responder en pantallas táctiles:** sumar una forma de
   escuchar cada opción sin seleccionarla; requiere acordar el patrón de
   interacción con el equipo. Actualmente las devoluciones se oyen al responder.
5. **Identidad y contenido:** confirmar la convivencia de Arandu como anfitrión
   del lugar y Tataendy como guía de “Los frutos del monte”, y preparar guiones
   definitivos antes de cerrar la producción sonora.
6. **Alcance de la producción:** el catálogo cubre los textos estáticos inventariados.
   Un texto nuevo o una combinación no inventariada usa la voz del dispositivo;
   debe pasar por catalogación y producción para tener la misma identidad.

La preferencia puede estar encendida antes de que el navegador permita reproducir
sonido: el inicio real espera una interacción. Si el navegador bloquea un audio,
“Repetir voz” vuelve a intentarlo sin perder la preferencia ni el texto. No se
promete reproducción automática antes del primer gesto del usuario.

Referencias: [W3C · control de audio](https://www.w3.org/WAI/WCAG21/Understanding/audio-control),
[MDN · voces disponibles](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices),
[Higgsfield · texto a voz](https://higgsfield.ai/text-to-speech).

### Mantener las voces

- `node herramientas/catalogar_voces.js`: actualiza el inventario desde los datos
  y conserva los trabajos ya generados.
- `python3 herramientas/generar_voces.py`: produce los pendientes con Higgsfield
  CLI; reanuda por ID sin regenerar los trabajos que ya tienen uno.
- `node herramientas/probar_sonido.js`: verifica cola, silencio, interrupciones,
  respaldo, subtítulos, repetición y migración de preferencias sin consumir créditos.
- `node herramientas/probar_vistas.js`: verifica las vistas y los recursos.
- `arte/voces/reparto.json`: voces propuestas por personaje.
- `arte/voces/catalogo.json`: textos, procedencia y estado de revisión.
- `arte/voces/audios.js`: índice local que usa el reproductor; no contiene credenciales.

La sala de escucha del equipo está en `herramientas/escucha-voces.html`. Se reconstruye
y verifica con `python3 herramientas/revisar_voces.py`; no reproduce audio al abrirla.
