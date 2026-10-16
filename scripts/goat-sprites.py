# Builds public/goat-v2.png and public/goat-props.png from the original
# public/goat.png, which is left untouched.
#
#   python3 -m venv .venv && .venv/bin/pip install pillow
#   .venv/bin/python scripts/goat-sprites.py .
#
# goat-v2.png rows (4 frames of 32x32 each): 0 down, 1 right, 2 up, 3 cuddle,
# 4 sleep (the original five), 5 left, 6 jump, 7/8 headbutt right/left,
# 9/10 eat right/left, 11 bleat. GoatAnimal.tsx's POSE_ROWS must match.
# goat-props.png (16x16 tiles): turnip, Z, heart, "!".
import sys
from PIL import Image

ROOT = sys.argv[1]
F = 32
src = Image.open(f'{ROOT}/public/goat.png').convert('RGBA')

OUT = (80, 50, 27, 255)       # outline
DARK = (104, 42, 58, 255)     # mouth
PINK = (233, 135, 117, 255)   # tongue
MAUVE = (167, 93, 77, 255)

def frame(col, row):
    return src.crop((col*F, row*F, col*F+F, row*F+F))

def split(im):
    """Opaque body vs. semi-transparent ground shadow."""
    body = Image.new('RGBA', im.size); shadow = Image.new('RGBA', im.size)
    for y in range(F):
        for x in range(F):
            p = im.getpixel((x, y))
            if p[3] == 255: body.putpixel((x, y), p)
            elif p[3] > 0: shadow.putpixel((x, y), p)
    return body, shadow

def shifted(im, dx, dy, mask=None):
    """Moves pixels (all, or those where mask(x, y) is true) by dx, dy; returns (moved, rest)."""
    moved = Image.new('RGBA', im.size); rest = Image.new('RGBA', im.size)
    for y in range(F):
        for x in range(F):
            p = im.getpixel((x, y))
            if p[3] == 0: continue
            if mask is None or mask(x, y):
                nx, ny = x + dx, y + dy
                if 0 <= nx < F and 0 <= ny < F: moved.putpixel((nx, ny), p)
            else:
                rest.putpixel((x, y), p)
    return moved, rest

def stack(*layers):
    out = Image.new('RGBA', (F, F))
    for l in layers: out.alpha_composite(l)
    return out

def shrink_shadow(shadow, n):
    """Trims n pixels off each end of every shadow row, so the shadow looks smaller."""
    out = Image.new('RGBA', shadow.size)
    for y in range(F):
        xs = [x for x in range(F) if shadow.getpixel((x, y))[3] > 0]
        if not xs: continue
        lo, hi = min(xs) + n, max(xs) - n
        for x in xs:
            if lo <= x <= hi: out.putpixel((x, y), shadow.getpixel((x, y)))
    return out

# Side view: the head, with the floppy ear hanging behind it (x 14-19,
# down to y=17), plus jaw and beard.
def side_head(x, y):
    return (x >= 14 and y <= 17) or (x >= 24 and 18 <= y <= 23 and not (y >= 21 and x <= 26))

BODY = (224, 139, 42, 255)

def neck(dy):
    """Fills where the head was: the back carries on at y=12, then slopes down
    one pixel per column towards the lowered head, which is drawn on top."""
    n = Image.new('RGBA', (F, F))
    if dy <= 0: return n
    for x in range(14, 22):
        for y in range(12 + max(0, x - 15), 18):
            n.putpixel((x, y), BODY)
    return n

def outline(im):
    """Closes edges a move exposed: a body pixel next to empty space becomes outline."""
    out = im.copy()
    solid = lambda x, y: 0 <= x < F and 0 <= y < F and im.getpixel((x, y))[3] == 255
    for y in range(F):
        for x in range(F):
            p = im.getpixel((x, y))
            if p[3] != 255 or p == OUT: continue
            if not all(solid(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                out.putpixel((x, y), OUT)
    return out

def lower_head(im, dy, dx=0):
    body, shadow = split(im)
    head, rest = shifted(body, dx, dy, side_head)
    return stack(shadow, outline(stack(neck(dy), rest, head)))

rows = [[frame(c, r) for c in range(4)] for r in range(5)]

# 5: walk left — the right-walk row mirrored.
rows.append([f.transpose(Image.FLIP_LEFT_RIGHT) for f in rows[1]])

# 6: jump — crouch, lift off, top, land. Only the body moves; the shadow stays and shrinks.
front = frame(0, 0)
body, shadow = split(front)
jump = []
for lift, shrink in [(-1, 0), (2, 2), (3, 3), (1, 1)]:
    moved, _ = shifted(body, 0, -lift)
    jump.append(stack(shrink_shadow(shadow, shrink), moved))
rows.append(jump)

# 7/8: headbutt — stand, wind up (lean back, head up), charge (head down), recover.
side = [frame(c, 1) for c in range(4)]
def lean(im, dx):
    b, s = split(im); m, _ = shifted(b, dx, 0); return stack(s, m)
butt = [side[0], lean(side[0], -2), lower_head(side[2], 3), lower_head(side[3], 2)]
rows.append(butt)
rows.append([f.transpose(Image.FLIP_LEFT_RIGHT) for f in butt])

# 9/10: eat — head lowered towards the ground, chewing (bobbing by a pixel).
eat = [lower_head(side[0], 5), lower_head(side[0], 6), lower_head(side[0], 5), lower_head(side[0], 6)]
rows.append(eat)
rows.append([f.transpose(Image.FLIP_LEFT_RIGHT) for f in eat])

# 11: bleat — front view, head tilts up, mouth opens.
def open_mouth(im, wide):
    im = im.copy()
    for x in (15, 16, 17): im.putpixel((x, 22), DARK)
    im.putpixel((16, 23), DARK)
    if wide:
        im.putpixel((15, 23), DARK); im.putpixel((17, 23), DARK)
        im.putpixel((16, 23), PINK); im.putpixel((16, 24), DARK)
    return im
def tilt_up(im):
    b, s = split(im)
    # The untouched body goes underneath so the row the head lifts off isn't left empty.
    head, _ = shifted(b, 0, -1, lambda x, y: y <= 23 and 9 <= x <= 23)
    return stack(s, b, head)
rows.append([front, open_mouth(front, False), tilt_up(open_mouth(front, True)), open_mouth(front, True)])

sheet = Image.new('RGBA', (4*F, len(rows)*F))
for r, fs in enumerate(rows):
    for c, f in enumerate(fs): sheet.paste(f, (c*F, r*F))
sheet.save(f'{ROOT}/public/goat-v2.png', optimize=True)

# Props: 16x16 tiles — turnip, Z, heart, "!".
P = 16
def tile(art, colors):
    t = Image.new('RGBA', (P, P))
    for y, line in enumerate(art):
        for x, ch in enumerate(line):
            if ch in colors: t.putpixel((x, y), colors[ch])
    return t
LEAF = (98, 160, 66, 255); LEAF_D = (52, 104, 48, 255)
WHITE = (255, 255, 230, 255); PURPLE = (150, 70, 140, 255); PURPLE_L = (200, 120, 180, 255)
RED = (222, 60, 70, 255); RED_L = (255, 140, 140, 255); YELLOW = (255, 226, 124, 255)
SH = (0, 0, 0, 70)
turnip = tile([
    "....#.....#.....",
    "...#g#...#g#....",
    "...#gg#.#gG#....",
    "....#gG#gG#.....",
    ".....#gGg#......",
    "......#G#.......",
    ".....#pPp#......",
    "....#pPPPp#.....",
    "...#pPPPPPp#....",
    "...#wpPPPpw#....",
    "...#wwwwwww#....",
    "...#wwwwwww#....",
    "....#wwwww#.....",
    ".....#www#......",
    "...__.#w#.__....",
    ".....___#__.....",
], {'#': OUT, 'g': LEAF, 'G': LEAF_D, 'p': PURPLE_L, 'P': PURPLE, 'w': WHITE, '_': SH})
z = tile([
    "................",
    "................",
    "...#########....",
    "...#wwwwwww#....",
    "...#######w#....",
    "........#w#.....",
    ".......#w#......",
    "......#w#.......",
    ".....#w#........",
    "....#w#.........",
    "...#w#######....",
    "...#wwwwwww#....",
    "...#########....",
    "................",
    "................",
    "................",
], {'#': OUT, 'w': WHITE})
heart = tile([
    "................",
    "................",
    "...###...###....",
    "..#rrr#.#rrr#...",
    ".#rlrRr#rRRRr#..",
    ".#rlRRRrRRRRr#..",
    ".#rRRRRRRRRRr#..",
    ".#rRRRRRRRRRr#..",
    "..#rRRRRRRRr#...",
    "...#rRRRRRr#....",
    "....#rRRRr#.....",
    ".....#rRr#......",
    "......#r#.......",
    ".......#........",
    "................",
    "................",
], {'#': OUT, 'r': RED, 'R': RED, 'l': RED_L})
bang = tile([
    "................",
    "......####......",
    "......#yy#......",
    "......#yy#......",
    "......#yy#......",
    "......#yy#......",
    "......#yy#......",
    "......#yy#......",
    "......#yy#......",
    "......####......",
    "................",
    "......####......",
    "......#yy#......",
    "......#yy#......",
    "......####......",
    "................",
], {'#': OUT, 'y': YELLOW})
props = Image.new('RGBA', (4*P, P))
for i, t in enumerate([turnip, z, heart, bang]): props.paste(t, (i*P, 0))
props.save(f'{ROOT}/public/goat-props.png', optimize=True)
print(sheet.size, props.size)
