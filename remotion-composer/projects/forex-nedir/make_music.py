"""Procedurally synthesise a calm, royalty-free bed for the explainer.

90 BPM, Am7 - Fmaj7 - Cmaj7 - G6 loop: warm pad, soft arpeggio pluck,
muted kick and shaker. Written from scratch, so there is no licence issue.
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 90
BEAT = 60 / BPM
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 95.0
out = sys.argv[1]

n = int(SR * DUR)
t = np.arange(n) / SR
mix = np.zeros(n)

def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)

CHORDS = [
    [57, 60, 64, 67],  # Am7
    [53, 57, 60, 64],  # Fmaj7
    [48, 55, 59, 64],  # Cmaj7
    [55, 59, 62, 64],  # G6
]
BAR = 4 * BEAT
rng = np.random.default_rng(7)

def env(length, a, r):
    e = np.ones(length)
    ai = min(length, int(a * SR))
    ri = min(length, int(r * SR))
    if ai:
        e[:ai] = np.linspace(0, 1, ai)
    if ri:
        e[-ri:] *= np.linspace(1, 0, ri)
    return e

bar_idx = 0
pos = 0.0
while pos < DUR:
    chord = CHORDS[bar_idx % 4]
    s = int(pos * SR)
    e = min(n, int((pos + BAR + 0.6) * SR))
    seg = np.arange(e - s) / SR
    # Pad: detuned soft saw-ish (few harmonics), slow attack.
    pad = np.zeros(e - s)
    for m in chord:
        f = midi(m - 12)
        for det in (-0.12, 0.12):
            ff = f * 2 ** (det / 12)
            for h, amp in ((1, 1.0), (2, 0.35), (3, 0.15)):
                pad += amp * np.sin(2 * np.pi * ff * h * seg + rng.uniform(0, 6.28))
    pad *= env(e - s, 0.9, 0.9) * 0.018
    mix[s:e] += pad
    # Bass: root, one note per bar.
    f = midi(chord[0] - 24)
    bs = np.sin(2 * np.pi * f * seg) * np.exp(-seg * 1.2) * 0.12
    mix[s:e] += bs * env(e - s, 0.01, 0.3)
    # Arpeggio pluck on eighths.
    notes = chord + [chord[1] + 12, chord[2] + 12, chord[3], chord[2]]
    for k in range(8):
        st = pos + k * BEAT / 2
        if st >= DUR:
            break
        i0 = int(st * SR)
        L = min(n - i0, int(0.6 * SR))
        tt = np.arange(L) / SR
        fq = midi(notes[k % len(notes)] + 12)
        pl = (np.sin(2 * np.pi * fq * tt) + 0.3 * np.sin(4 * np.pi * fq * tt)) * np.exp(-tt * 7)
        mix[i0:i0 + L] += pl * 0.035 * env(L, 0.004, 0.05)
    # Kick on 1 and 3, shaker on off-beats.
    for k in range(4):
        st = pos + k * BEAT
        if st >= DUR:
            break
        i0 = int(st * SR)
        if k in (0, 2):
            L = min(n - i0, int(0.35 * SR))
            tt = np.arange(L) / SR
            kick = np.sin(2 * np.pi * (45 + 70 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9)
            mix[i0:i0 + L] += kick * 0.22
        i1 = int((st + BEAT / 2) * SR)
        L = min(n - i1, int(0.08 * SR))
        if L > 0:
            noise = rng.normal(0, 1, L) * np.exp(-np.arange(L) / SR * 60)
            noise = np.diff(noise, prepend=0)  # crude high-pass
            mix[i1:i1 + L] += noise * 0.012
    pos += BAR
    bar_idx += 1

# Fade in/out and normalise.
fade = int(2.5 * SR)
mix[:fade] *= np.linspace(0, 1, fade)
mix[-fade:] *= np.linspace(1, 0, fade)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.8
stereo = np.stack([mix, np.roll(mix, int(0.012 * SR))], axis=1)
data = (stereo * 32767).astype(np.int16)
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print(out, DUR)
