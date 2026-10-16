"""Reconstruye los loops sin la disolución incluida en los videos originales.

Ejecutar: uv run --with numpy python herramientas/cerrar_loops_bienvenida.py
Conserva el tramo limpio de cada gesto y lo recorre con velocidad sinusoidal:
la velocidad llega a cero antes de invertir el movimiento. No mezcla poses
lejanas ni añade un fundido entre el final y el inicio. Interpola únicamente
cuadros contiguos, con RGB premultiplicado para conservar la transparencia.
"""
from pathlib import Path
import json
import subprocess

import numpy as np

ROOT = Path(__file__).resolve().parents[1] / 'arte' / 'bienvenida'
OUTPUT = ROOT / 'loops-v4'
NAMES = ['arandu', 'tortuga', 'garza', 'kapi', 'yarara', 'caraya', 'yabiru']
FPS = 30
DURATION = 10
# Los originales incluyen una disolución hacia el dibujo base en sus extremos.
CLEAN_START = 0.55
CLEAN_END = 4.40


def decode(path):
    meta = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_entries',
        'stream=width,height,r_frame_rate', '-of', 'json', str(path)
    ]))['streams'][0]
    width, height = meta['width'], meta['height']
    num, den = map(int, meta['r_frame_rate'].split('/'))
    raw = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-c:v', 'libvpx-vp9', '-i', str(path),
        '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'
    ])
    return np.frombuffer(raw, np.uint8).reshape(-1, height, width, 4), num / den


def visible(frames):
    result = frames.astype(np.float32) / 255
    result[..., :3] *= result[..., 3:4]
    return result


def verify(path):
    frames, _ = decode(path)
    # Medir sobre el personaje: el espacio transparente no diluye el resultado.
    small = visible(frames[:, ::3, ::3])
    mask = small[..., 3].max(axis=0) > 0.1
    steps = np.abs(small - np.roll(small, 1, axis=0))[:, mask].mean(axis=(1, 2)) * 255
    return {
        'frames': len(frames),
        'alpha_range': [int(frames[..., 3].min()), int(frames[..., 3].max())],
        'seam_mae': round(float(steps[0]), 4),
        'turn_mae': round(float(steps[len(frames) // 2]), 4),
        'typical_step_mae': round(float(np.median(steps)), 4),
        'p95_step_mae': round(float(np.percentile(steps, 95)), 4),
    }


def main():
    OUTPUT.mkdir(exist_ok=True)
    report = []
    for name in NAMES:
        source, source_fps = decode(ROOT / f'{name}.webm')
        height, width = source.shape[1:3]
        count = FPS * DURATION
        target = OUTPUT / f'{name}.webm'
        encoder = subprocess.Popen([
            'ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba',
            '-s', f'{width}x{height}', '-r', str(FPS), '-i', '-',
            '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-lossless', '1',
            '-row-mt', '1', '-auto-alt-ref', '0', '-an', str(target)
        ], stdin=subprocess.PIPE)
        for index in range(count):
            # Medio cuadro de fase: ambos lados del cierre tienen igual pose.
            phase = 2 * np.pi * (index + 0.5) / count
            time = CLEAN_START + (CLEAN_END - CLEAN_START) * (1 - np.cos(phase)) / 2
            position = time * source_fps
            left = int(position)
            fraction = position - left
            pair = visible(source[left:left + 2])
            frame = pair[0] * (1 - fraction) + pair[1] * fraction
            np.divide(frame[..., :3], frame[..., 3:4], out=frame[..., :3], where=frame[..., 3:4] > 0)
            encoder.stdin.write(np.rint(frame * 255).clip(0, 255).astype(np.uint8).tobytes())
        encoder.stdin.close()
        if encoder.wait():
            raise RuntimeError(f'No se pudo exportar {target}')
        metrics = {'name': name, 'clean_source_seconds': [CLEAN_START, CLEAN_END], **verify(target)}
        if metrics['frames'] != count or metrics['alpha_range'] != [0, 255]:
            raise RuntimeError(f'Video incompleto o sin transparencia: {name}')
        if metrics['seam_mae'] > metrics['typical_step_mae']:
            raise RuntimeError(f'El cierre supera el cambio de cuadro habitual: {name}')
        report.append(metrics)
        print(json.dumps(metrics), flush=True)
    (OUTPUT / 'verificacion.json').write_text(json.dumps(report, indent=2) + '\n')


if __name__ == '__main__':
    main()
