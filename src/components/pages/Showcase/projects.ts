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
}

// Cards are shown in this order.
const projects: Project[] = [
    {
        title: "Goat Companion",
        description:
            "A tiny pixel-art goat to walk around, cuddle and put to sleep, with the keyboard or by tapping the controls.",
        href: "/goat",
        preview: "/showcase/goat.gif",
        previewStill: "/showcase/goat.png",
        previewAlt: "A pixel-art goat walking across the screen",
        pixelArt: true,
        tech: ["Next.js", "React", "TypeScript", "Sass"],
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
