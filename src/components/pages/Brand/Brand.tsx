import TextLink from "../../atoms/TextLink/TextLink";
import Turnip, { TURNIP_HEIGHT, TURNIP_WIDTH } from "../../atoms/Turnip/Turnip";
import { brandColors, labelColor, textOnWhite } from "./brandColors";
import "./Brand.scss";

// The turnip at the sizes it is actually used at, by whole-pixel scale.
const TURNIP_SIZES = [
    { scale: 1, use: "Favicon, browser tab" },
    { scale: 2, use: "Header logo" },
    { scale: 4, use: "404 page, app icons" },
];

const TYPE_SCALE = [
    { size: 60, use: "Page titles" },
    { size: 32, use: "Highlights" },
    { size: 22, use: "Intros" },
    { size: 18, use: "Body text" },
];

const VOICE = [
    { line: "Where to find me (if you must!)", where: "Header menu" },
    { line: "This page has gone to seed", where: "404 page" },
    { line: "I write code. I read books. I drink tea. I do stuff.", where: "Home" },
];

// A guide to how this site looks, built from the same tokens and components
// it documents, so it can't drift from the real thing.
const Brand = () => (
    <div className="brand">
        <header className="brand__header">
            <h1 className="brand__title">Brand identity</h1>
            <p className="brand__intro">
                How this site looks, and why: a pixel turnip, a soft palette, one typeface and a
                handful of components everything is built from.
            </p>
        </header>

        <section className="brand__section" aria-labelledby="brand-why">
            <h2 id="brand-why" className="brand__subtitle">Why a turnip?</h2>
            <div className="brand__text">
                <p>
                    Honestly, I don&apos;t remember. I picked the name years ago and the reason got
                    lost somewhere along the way. But it has grown on me, and now I know what it
                    stands for.
                </p>
                <p>
                    Most of a turnip is underground. Most of a good website is too: the structure,
                    the accessibility, the performance nobody sees. The leaves are just the part
                    that shows.
                </p>
            </div>
        </section>

        <section className="brand__section" aria-labelledby="brand-turnip">
            <h2 id="brand-turnip" className="brand__subtitle">The turnip</h2>
            <div className="brand__mascot">
                <div className="brand__turnip-grid">
                    <Turnip className="brand__turnip-hero" />
                </div>
                <div className="brand__text">
                    <p>
                        The mascot and logo: a {TURNIP_WIDTH} × {TURNIP_HEIGHT} pixel turnip, drawn in
                        the palette and nothing else. It is the header logo, the favicon, the 404 page
                        and a few of the particles drifting in the background.
                    </p>
                    <ul className="brand__rules">
                        <li>Scale it by whole pixels (2×, 3×, 4×…) so the edges stay crisp.</li>
                        <li>Keep it upright when it stands still. Only the particles spin.</li>
                        <li>Don&apos;t smooth, outline or recolour it.</li>
                    </ul>
                </div>
            </div>
            <ul className="brand__sizes">
                {TURNIP_SIZES.map(({ scale, use }) => (
                    <li key={scale} className="brand__size">
                        <Turnip className="brand__size-art" />
                        <span className="brand__size-label">
                            <strong>{TURNIP_WIDTH * scale} × {TURNIP_HEIGHT * scale}px</strong>
                            {use}
                        </span>
                    </li>
                ))}
            </ul>
        </section>

        <section className="brand__section" aria-labelledby="brand-colors">
            <h2 id="brand-colors" className="brand__subtitle">Colours</h2>
            <p className="brand__text">
                Soft and slightly muted, so the turnip and the content stand out. Every colour is a
                CSS custom property; the contrast shown is against white, by WCAG AA.
            </p>
            <ul className="brand__swatches">
                {brandColors.map(({ token, name, hex, role }) => {
                    const { ratio, verdict } = textOnWhite(hex);
                    return (
                        <li key={token} className="brand__swatch">
                            <div
                                className="brand__swatch-chip"
                                style={{ background: hex, color: labelColor(hex) }}
                            >
                                {hex}
                            </div>
                            <div className="brand__swatch-body">
                                <h3 className="brand__swatch-name">{name}</h3>
                                <code className="brand__swatch-token">
                                    {token === "white" ? "#fff" : `var(${token})`}
                                </code>
                                <p className="brand__swatch-role">{role}</p>
                                {token !== "white" && (
                                    <p className="brand__swatch-contrast">
                                        {ratio.toFixed(1)}:1 on white · {verdict}
                                    </p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>

        <section className="brand__section" aria-labelledby="brand-type">
            <h2 id="brand-type" className="brand__subtitle">Type</h2>
            <p className="brand__text">
                One typeface for everything: VT323, a monospaced pixel font that matches the turnip.
                It is self-hosted, so pages make no request to Google Fonts. Hierarchy comes from size
                and weight, never from a second family.
            </p>
            <ul className="brand__type">
                {TYPE_SCALE.map(({ size, use }) => (
                    <li key={size} className="brand__type-row">
                        <span className="brand__type-meta">{size}px · {use}</span>
                        <span className="brand__type-sample" style={{ fontSize: size }}>
                            Turnips, tea &amp; code
                        </span>
                    </li>
                ))}
            </ul>
        </section>

        <section className="brand__section" aria-labelledby="brand-components">
            <h2 id="brand-components" className="brand__subtitle">Components</h2>
            <p className="brand__text">
                Flat and a little retro: white cards with a 2px ink border, rounded corners and a hard
                offset shadow instead of a blur. Things lift on hover and press in on click.
            </p>
            <div className="brand__components">
                <div className="brand__sample">
                    <h3 className="brand__sample-title">Links</h3>
                    <p>
                        Links in a sentence get a{" "}
                        <TextLink href="/showcase/">pixel dashed underline</TextLink>.
                    </p>
                    <p className="brand__actions">
                        <TextLink href="/showcase/" variant="action">See my work</TextLink>
                        <TextLink href="/contacts/" variant="action">Say hi</TextLink>
                    </p>
                </div>
                <div className="brand__sample">
                    <h3 className="brand__sample-title">Chips</h3>
                    <p className="brand__chips">
                        <span className="brand__chip">React</span>
                        <span className="brand__chip">TypeScript</span>
                        <span className="brand__chip brand__chip--yellow">New</span>
                    </p>
                </div>
                <div className="brand__sample">
                    <h3 className="brand__sample-title">Card shadows</h3>
                    <ul className="brand__shadows">
                        {["teal", "purple", "yellow", "green"].map((color) => (
                            <li
                                key={color}
                                className="brand__shadow"
                                style={{ boxShadow: `6px 6px 0 var(--${color})` }}
                            >
                                {color}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>

        <section className="brand__section" aria-labelledby="brand-motion">
            <h2 id="brand-motion" className="brand__subtitle">Motion</h2>
            <ul className="brand__rules brand__text">
                <li>
                    Calm by default: a few dots and turnips drift in the background, and nothing
                    moves fast or flashes.
                </li>
                <li>
                    Visitors are in control: the buttons in the bottom-right corner pause or hide the
                    background on every page.
                </li>
                <li>
                    Reduced motion is respected everywhere: the background starts still and
                    transitions are switched off.
                </li>
            </ul>
        </section>

        <section className="brand__section" aria-labelledby="brand-voice">
            <h2 id="brand-voice" className="brand__subtitle">Voice</h2>
            <p className="brand__text">
                First person, short and a little silly, the way I&apos;d say it out loud. Clear first,
                funny second: the joke never hides what a button does.
            </p>
            <ul className="brand__voice">
                {VOICE.map(({ line, where }) => (
                    <li key={line} className="brand__quote">
                        <q>{line}</q>
                        <span className="brand__quote-where">{where}</span>
                    </li>
                ))}
            </ul>
        </section>
    </div>
);

export default Brand;
