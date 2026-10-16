# The pixel turnip from src/components/atoms/Turnip/Turnip.tsx as a Pillow
# image, coloured with src/themes/palette.scss. Shared by turnip-icons.py and
# turnip-gif.py.
import re
from PIL import Image


def load_turnip(root):
    tsx = open(f'{root}/src/components/atoms/Turnip/Turnip.tsx').read()
    scss = open(f'{root}/src/themes/palette.scss').read()

    pixels = re.findall(r'^\s*"([.A-Z]+)",$', re.search(r'const PIXELS = \[(.*?)\];', tsx, re.S).group(1), re.M)
    variables = dict(re.findall(r'(--[\w-]+):\s*(#[0-9A-Fa-f]{6})', scss))

    def rgba(value):
        if value.startswith('var('):
            value = variables[re.match(r'var\((--[\w-]+)\)', value).group(1)]
        value = value.lstrip('#')
        if len(value) == 3: value = ''.join(c * 2 for c in value)
        return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4)) + (255,)

    colors = {key: rgba(value) for key, value in re.findall(
        r'^\s*(\w): "([^"]+)",$', re.search(r'const COLORS[^{]*\{(.*?)\};', tsx, re.S).group(1), re.M)}

    art = Image.new('RGBA', (len(pixels[0]), len(pixels)))
    for y, row in enumerate(pixels):
        for x, key in enumerate(row):
            if key != '.': art.putpixel((x, y), colors[key])
    return art
