# Builds public/showcase/brand.gif (and brand.png, its still frame for
# reduced motion), the brand identity card's preview: the turnip in the
# middle, idly drifting and bobbing, its leaves swaying a beat behind.
#
#   python3 -m venv .venv && .venv/bin/pip install pillow
#   .venv/bin/python scripts/turnip-gif.py .
#
# Drawn at 80 x 50 and scaled 6x by whole pixels to the 480 x 300 of the
# other card previews; the card shows it with image-rendering: pixelated.
import math
import sys
from PIL import Image
from turnip_art import load_turnip

ROOT = sys.argv[1]
W, H, SCALE = 80, 50, 6
SKY = (240, 244, 240, 255)       # the card preview background
FRAMES, MS = 32, 100             # one 3.2s loop

turnip = load_turnip(ROOT)
TW, TH = turnip.size

def sway(phase):
    """The turnip with its leaves (the top 6 rows) nudged `phase` pixels sideways."""
    if phase == 0: return turnip
    out = turnip.copy()
    leaves = turnip.crop((0, 0, TW, 6))
    out.paste((0, 0, 0, 0), (0, 0, TW, 6))
    out.alpha_composite(leaves, (phase, 0))
    return out

def frame(t):
    """The scene at t in [0, 1): a slow figure-of-eight drift, whole pixels only."""
    dx = round(2 * math.sin(2 * math.pi * t))
    dy = round(1.5 * math.sin(4 * math.pi * t))
    # The leaves trail the body, so they swing the other way as it turns.
    leaf = round(-math.sin(2 * math.pi * t - 0.6))
    image = Image.new('RGBA', (W, H), SKY)
    image.alpha_composite(sway(leaf), ((W - TW) // 2 + dx, (H - TH) // 2 + dy))
    return image.resize((W * SCALE, H * SCALE), Image.NEAREST).convert('RGB')

images = [frame(i / FRAMES) for i in range(FRAMES)]
images[0].save(
    f'{ROOT}/public/showcase/brand.gif',
    save_all=True,
    append_images=images[1:],
    duration=MS,
    loop=0,
    optimize=True,
    disposal=1,
)
images[0].save(f'{ROOT}/public/showcase/brand.png', optimize=True)
print(f'{FRAMES} frames, {FRAMES * MS / 1000:.1f}s')
