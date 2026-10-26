# Builds public/showcase/locanda.gif (and locanda.png, its still frame for
# reduced motion), the Locanda card's preview: the innkeeper, Locanda's
# mascot, going through his four poses (welcome, sleepy, lost, offline).
# The pixel grids and colours are read from the Locanda repo, so the GIF
# matches the real mascot.
#
#   python3 -m venv .venv && .venv/bin/pip install pillow
#   .venv/bin/python scripts/innkeeper-gif.py . ../locanda
#
# Drawn at 48 x 30 and scaled 10x by whole pixels to the 480 x 300 of the
# other card previews; the card shows it with image-rendering: pixelated.
import json
import re
import sys
from PIL import Image

ROOT, LOCANDA = sys.argv[1], sys.argv[2]
W, H, SCALE = 48, 30, 10
SKY = (240, 244, 240, 255)       # the card preview background
MS = 600                         # one frame, as in Locanda's globals.css
LOOPS = 2                        # times each pose's two frames take turns

poses_ts = open(f'{LOCANDA}/src/components/mascot/poses.ts').read()
mascot = json.load(open(f'{LOCANDA}/src/styles/tokens.json'))['mascot']

def colour(utility):
    """'fill-mascot-grey-deep' -> the light theme hex of tokens.json mascot.greyDeep."""
    name = re.sub(r'-(\w)', lambda m: m.group(1).upper(), utility.removeprefix('fill-mascot-'))
    value = mascot[name]
    value = value['light'] if isinstance(value, dict) else value
    return tuple(int(value[i:i + 2], 16) for i in (1, 3, 5)) + (255,)

pixels_block = re.search(r'export const PIXELS = \{(.*?)\}', poses_ts, re.S).group(1)
PIXELS = {key: colour(utility) for key, utility in re.findall(r"(\w): '([\w-]+)'", pixels_block)}

poses_block = re.search(r'export const POSES = \{(.*?)\n\} as const', poses_ts, re.S).group(1)
POSES = {}
for name, body in re.findall(r'\n  (\w+): \[(.*?)\n  \],', poses_block, re.S):
    POSES[name] = [re.findall(r"'([^']+)'", frame) for frame in re.split(r'\n    \],?', body) if "'" in frame]

def frame(grid):
    """One frame of the innkeeper, centred on the card background."""
    sprite = Image.new('RGBA', (len(grid[0]), len(grid)))
    for y, row in enumerate(grid):
        for x, key in enumerate(row):
            if key != '.': sprite.putpixel((x, y), PIXELS[key])
    image = Image.new('RGBA', (W, H), SKY)
    image.alpha_composite(sprite, ((W - sprite.width) // 2, (H - sprite.height) // 2))
    return image.resize((W * SCALE, H * SCALE), Image.NEAREST).convert('RGB')

images = [frame(grid) for frames in POSES.values() for _ in range(LOOPS) for grid in frames]
images[0].save(
    f'{ROOT}/public/showcase/locanda.gif',
    save_all=True,
    append_images=images[1:],
    duration=MS,
    loop=0,
    optimize=True,
    disposal=1,
)
images[0].save(f'{ROOT}/public/showcase/locanda.png', optimize=True)
print(f'{", ".join(POSES)}: {len(images)} frames, {len(images) * MS / 1000:.1f}s')
