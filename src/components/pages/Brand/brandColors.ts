export interface BrandColor {
    // CSS custom property from src/themes/palette.scss, or "white".
    token: string;
    name: string;
    // Must match palette.scss (checked by brand.test.ts).
    hex: string;
    role: string;
}

export const WHITE = "#FFFFFF";
export const INK = "#1F1F1F";

// The palette in the order the guide shows it.
export const brandColors: BrandColor[] = [
    {
        token: "--teal",
        name: "Teal",
        hex: "#018C99",
        role: "The main accent: borders, focus rings, active states and offset shadows. On white, only for icons and large text.",
    },
    {
        token: "--dark-teal",
        name: "Dark teal",
        hex: "#2B6F78",
        role: "Teal for text: inline links and subtitles. Also a fill behind white text.",
    },
    {
        token: "--purple",
        name: "Purple",
        hex: "#7B5E8F",
        role: "The second accent: hover states, chips, card headers and the turnip's skin.",
    },
    {
        token: "--light-purple",
        name: "Light purple",
        hex: "#D2BFDA",
        role: "Soft details: dashed borders and the shine on the turnip. Never text.",
    },
    {
        token: "--green",
        name: "Green",
        hex: "#2F5753",
        role: "The deep accent: card headers, small print and the veins of the turnip's leaves.",
    },
    {
        token: "--yellow",
        name: "Yellow",
        hex: "#F8C210",
        role: "The sunny highlight: offset shadows, badges and particles. Always with ink on top.",
    },
    {
        token: "--blue",
        name: "Blue",
        hex: "#6189B7",
        role: "In the palette, not in use yet.",
    },
    {
        token: "--gray",
        name: "Ink",
        hex: INK,
        role: "Text, outlines and the turnip's outline.",
    },
    {
        token: "white",
        name: "Paper",
        hex: WHITE,
        role: "Backgrounds, cards and the turnip's root.",
    },
];

// WCAG 2 relative luminance and contrast ratio.
const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a: string, b: string) => {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
};

// What a colour can do as text on white, by WCAG AA.
export const textOnWhite = (hex: string) => {
    const ratio = contrast(hex, WHITE);
    if (ratio >= 4.5) return { ratio, verdict: "Any text" };
    if (ratio >= 3) return { ratio, verdict: "Large text and icons" };
    return { ratio, verdict: "Not for text" };
};

// Ink or white, whichever reads better on top of the colour.
export const labelColor = (hex: string) =>
    contrast(hex, INK) >= contrast(hex, WHITE) ? INK : WHITE;
