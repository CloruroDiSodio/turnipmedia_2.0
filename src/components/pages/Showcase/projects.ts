export interface Project {
    title: string;
    description: string;
    // Internal route ("/goat") or full URL ("https://...").
    href: string;
    // Preview image or GIF, served from public/showcase/. The CSP only allows
    // same-origin images, so external screenshots have to be copied there.
    preview: string;
    // Still frame shown instead of an animated preview when the visitor
    // asks for reduced motion.
    previewStill?: string;
    // Describes the preview for screen readers.
    previewAlt: string;
    // Scales the preview without smoothing, to keep pixel art crisp.
    pixelArt?: boolean;
    // Technologies used, shown as chips on the card.
    tech: string[];
    // For work at a company: my role there, shown under the title, since
    // these sites were built by a team rather than by me alone.
    role?: string;
    // Opens in the current tab instead of a new one: for pages that are part
    // of this site's own story rather than a separate project.
    sameTab?: boolean;
}

// Cards are shown in this order.
const projects: Project[] = [
    {
        title: "Turnip Brand Identity",
        description:
            "The brand guide for this site: a pixel turnip mascot that doubles as logo and favicon, a soft palette with its contrast checked against WCAG, one pixel typeface, and the components, motion and voice everything shares.",
        href: "/showcase/brand/",
        preview: "/showcase/brand.gif",
        previewStill: "/showcase/brand.png",
        previewAlt: "The pixel turnip mascot, gently swaying",
        pixelArt: true,
        sameTab: true,
        tech: ["Branding", "Pixel art", "Design tokens", "Sass", "Python"],
    },
    {
        title: "Locanda",
        description:
            "A free spell and character companion for fifth edition players: search every spell in the SRD, keep a spellbook for each character and take it to the table as an accessible PDF or printable spell cards. In English and Italian, offline, with no account and no tracking.",
        href: "https://locanda.quest/",
        preview: "/showcase/locanda.gif",
        previewStill: "/showcase/locanda.png",
        previewAlt: "The innkeeper, Locanda's pixel-art mascot, waving, dozing over a mug, scratching his head and holding a snuffed candle",
        pixelArt: true,
        tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "next-intl", "IndexedDB"],
    },
    {
        title: "Pixel Art & Pattern Generator",
        description:
            "Turns any photo into a pixel art grid on a retro palette (NES, PICO-8, Game Boy) and exports a printable cross stitch pattern as PNG, CSV or Markdown.",
        href: "https://turnipmedia-pixel-pattern-generator.netlify.app/",
        preview: "/showcase/pixel-pattern-generator.jpg",
        previewAlt: "The generator turning a sunset landscape into a 32 by 24 pixel grid",
        tech: ["Next.js", "Tailwind CSS", "Python", "FastAPI", "Pillow"],
    },
    {
        title: "Goat Companion",
        description:
            "A tiny pixel-art virtual pet: a goat that gets hungry, sleepy and lonely. Walk it around its pen, feed it turnips, play and cuddle to keep it happy, with the keyboard or by tapping the controls.",
        href: "/goat",
        preview: "/showcase/goat.gif",
        previewStill: "/showcase/goat.png",
        previewAlt: "A pixel-art goat walking across the screen",
        pixelArt: true,
        tech: ["Next.js", "React", "TypeScript", "Sass"],
    },
    {
        title: "ChibiUI",
        description:
            "An open-source React component library with a soft pastel, kawaii look. Built on Radix primitives, axe-tested and checked against WCAG AA, strictly typed, themeable through design tokens and tree-shakable.",
        href: "https://chibi-ui.netlify.app/",
        preview: "/showcase/chibi-ui.jpg",
        previewAlt: "The ChibiUI homepage with a smiling cat mascot and the headline “Serious components, adorably dressed.”",
        tech: ["React", "TypeScript", "Radix UI", "Tailwind CSS", "Design tokens"],
    },
];

// Sites I worked on as part of a company team. Cards are shown in this order.
export const workProjects: Project[] = [
    {
        title: "truelayer.com",
        role: "Web Developer at TrueLayer",
        description:
            "Led the website redesign and its migration to Next.js and Storyblok; I own the internal component library the pages are built from.",
        href: "https://truelayer.com/",
        preview: "/showcase/truelayer.jpg",
        previewAlt: "The truelayer.com homepage",
        tech: ["Next.js", "React", "Storyblok", "Design system"],
    },
    {
        title: "arduino.cc",
        role: "Software Engineer at Arduino",
        description:
            "Worked on the institutional web apps and the subscription management flows, built on a shared component library.",
        href: "https://www.arduino.cc/",
        preview: "/showcase/arduino.jpg",
        previewAlt: "The arduino.cc homepage",
        tech: ["Next.js", "DatoCMS", "Component library"],
    },
];

export default projects;
