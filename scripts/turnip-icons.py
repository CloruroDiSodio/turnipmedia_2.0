# Builds the favicon, app and tile icons in public/ from the pixel turnip in
# src/components/atoms/Turnip/Turnip.tsx, coloured with src/themes/palette.scss,
# so re-run it after changing either.
#
#   python3 -m venv .venv && .venv/bin/pip install pillow
#   .venv/bin/python scripts/turnip-icons.py .
#
# The art is scaled by whole pixels so it stays crisp, and centred. Only the
# 16px favicon is too small for that (the turnip is 21px tall) and is
# downsampled instead.
import sys
from PIL import Image
from turnip_art import load_turnip

ROOT = sys.argv[1]
art = load_turnip(ROOT)
W, H = art.size

WHITE = (255, 255, 255, 255)
CLEAR = (0, 0, 0, 0)

def icon(size, padding=0.0, background=CLEAR):
    """The turnip centred on a size x size square, `padding` (a fraction of the side) kept clear around it."""
    room = size * (1 - 2 * padding)
    scale = int(room // H)
    if scale >= 1:
        turnip = art.resize((W * scale, H * scale), Image.NEAREST)
    else:
        big = art.resize((W * 16, H * 16), Image.NEAREST)
        turnip = big.resize((max(1, round(room * W / H)), round(room)), Image.LANCZOS)
    canvas = Image.new('RGBA', (size, size), background)
    canvas.alpha_composite(turnip, ((size - turnip.width) // 2, (size - turnip.height) // 2))
    return canvas

def save(name, image):
    image.save(f'{ROOT}/public/{name}', optimize=True)

# Browser tabs: as big as fits.
for size in (16, 32, 96):
    save(f'favicon-{size}x{size}.png', icon(size))
icon(48).save(f'{ROOT}/public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)],
              append_images=[icon(16), icon(32)])

# Android and the web app manifest: transparent, a little breathing room.
for size in (36, 48, 72, 96, 144, 192):
    save(f'android-icon-{size}x{size}.png', icon(size, 0.05))
for size in (192, 512):
    save(f'logo{size}.png', icon(size, 0.05))

# iOS fills transparency with black, so these get a white tile and the
# margin iOS home-screen icons usually have.
for size in (57, 60, 72, 76, 114, 120, 144, 152, 180):
    save(f'apple-icon-{size}x{size}.png', icon(size, 0.12, WHITE))
for name in ('apple-icon.png', 'apple-icon-precomposed.png'):
    save(name, icon(192, 0.12, WHITE))

# Windows tiles: transparent over the TileColor, with the tile padding.
for size in (70, 144, 150, 310):
    save(f'ms-icon-{size}x{size}.png', icon(size, 0.15))
