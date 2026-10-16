// A pixel-art turnip, drawn from a character map so it matches the VT323
// look. Each row is cut into runs of the same colour, one <rect> per run.
const PIXELS = [
    "....KK....KK....",
    "...KGGK..KGGK...",
    "...KGDGKKGDGK...",
    "....KGDGGDGK....",
    ".....KGDDGK.....",
    "......KGGK......",
    "....KKKKKKKK....",
    "..KKPPPPPPPPKK..",
    ".KPPPPLPPPPPPPK.",
    ".KPPPLLPPPPPPPK.",
    "KPPPPPPPPPPPPPPK",
    "KWWPPPPPPPPPPWWK",
    "KWWWWWPPPPWWWWWK",
    "KWWWWWWWWWWWWWWK",
    ".KWWWWWWWWWWWWK.",
    ".KWWWWWWWWWWWWK.",
    "..KWWWWWWWWWWK..",
    "...KKWWWWWWKK...",
    ".....KKWWKK.....",
    ".......KK.......",
    "........K.......",
];

const COLORS: Record<string, string> = {
    K: "var(--gray)",
    G: "var(--teal)",
    D: "var(--green)",
    P: "var(--purple)",
    L: "var(--light-purple)",
    W: "#fff",
};

const RUNS = PIXELS.flatMap((row, y) =>
    [...row.matchAll(/([^.])\1*/g)].map((match) => ({
        x: match.index,
        y,
        width: match[0].length,
        fill: COLORS[match[1]],
    }))
);

export const TURNIP_WIDTH = PIXELS[0].length;
export const TURNIP_HEIGHT = PIXELS.length;

// The same turnip as a standalone SVG data URI, for the particle background,
// which draws it onto a canvas. CSS variables don't resolve inside an image,
// so they are read from the page here: the palette stays the single source.
// Client-only (needs `document`). Drawn at `scale` so it stays crisp when the
// canvas scales it down.
export const turnipImageSrc = (scale = 4) => {
    const root = getComputedStyle(document.documentElement);
    const resolve = (fill: string) =>
        fill.replace(/var\((--[\w-]+)\)/, (_, name) => root.getPropertyValue(name).trim());
    const rects = RUNS.map(({ x, y, width, fill }) =>
        `<rect x="${x}" y="${y}" width="${width}" height="1" fill="${resolve(fill)}"/>`
    ).join("");
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${TURNIP_WIDTH * scale}" height="${TURNIP_HEIGHT * scale}" ` +
        `viewBox="0 0 ${TURNIP_WIDTH} ${TURNIP_HEIGHT}" shape-rendering="crispEdges">${rects}</svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const Turnip = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox={`0 0 ${TURNIP_WIDTH} ${TURNIP_HEIGHT}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
        focusable="false"
    >
        {RUNS.map(({ x, y, width, fill }) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={width} height={1} fill={fill} />
        ))}
    </svg>
);

export default Turnip;
