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
