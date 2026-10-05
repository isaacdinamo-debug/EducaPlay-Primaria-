#!/bin/bash
# Empaqueta los clips de los compañeros para la web, como los de Kapi:
# 540x720, H.264 yuv420p, sin audio. Dos cuidados:
#   · principio y cola van clavados al dibujo base: el bucle y el cambio
#     de gesto cierran sin salto;
#   · Seedance devuelve 10 bits: se convierte a 8 antes de codificar.
# Uso: herramientas/empaquetar_clips.sh   (procesa lo que haya en arte/originales/video)
cd "$(dirname "$0")/.." || exit 1
TMP=$(mktemp -d)
for src in arte/originales/video/*-*.mp4; do
  n=$(basename "$src" .mp4); q=${n%%-*}
  # el ancla es el dibujo base del personaje, no el primer cuadro del clip:
  # a veces Seedance arranca ya en movimiento (la yabirú festeja con las alas
  # abiertas desde el cuadro cero) y el cambio de gesto saltaría.
  ffmpeg -v error -y -i "arte/originales/v3/base-$q.png" -vf scale=540:720 "$TMP/$q.png"
  ffmpeg -v error -y -loop 1 -t 0.3 -i "$TMP/$q.png" -i "$src" -loop 1 -t 0.6 -i "$TMP/$q.png" -filter_complex \
    "[0:v]format=yuv420p,fps=24,setsar=1[a];[1:v]format=yuv420p,fps=24,scale=540:720,setsar=1[b];[2:v]format=yuv420p,fps=24,setsar=1[c];[a][b]xfade=transition=fade:duration=0.25:offset=0.05[ab];[ab][c]xfade=transition=fade:duration=0.4:offset=4.65,format=yuv420p[v]" \
    -map "[v]" -an -c:v libx264 -crf 29 -preset slow -movflags +faststart \
    -color_primaries bt709 -color_trc bt709 -colorspace bt709 "arte/companeros-video/$n.mp4"
  echo "$n $(ls -l "arte/companeros-video/$n.mp4" | awk '{print $5}')"
done
# el póster de cada compañero es el primer cuadro de su reposo
for r in arte/companeros-video/*-reposo.mp4; do
  q=$(basename "$r" -reposo.mp4)
  ffmpeg -v error -y -i "$r" -frames:v 1 -q:v 3 "arte/companeros-video/$q.jpg"
done
rm -rf "$TMP"
