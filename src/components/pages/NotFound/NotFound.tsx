"use client";

import { useEffect, useRef, useState } from "react";
import TextLink from "../../atoms/TextLink/TextLink";
import Turnip from "./Turnip";
import { usePrefersReducedMotion } from "../Goat/usePrefersReducedMotion";
import './NotFound.scss';

interface Find {
    emoji: string;
    name: string;
    quip: string;
}

// What turns up under the turnips, dealt out in a random order.
const FINDS: Find[] = [
    { emoji: "🦆", name: "a rubber duck", quip: "It has heard things about this codebase." },
    { emoji: "🧦", name: "the goat's missing sock", quip: "She has been asking about it." },
    { emoji: "🍵", name: "a cup of tea", quip: "Still warm. Suspicious." },
    { emoji: "📕", name: "a book with the last page torn out", quip: "Now we'll never know who did it." },
    { emoji: "🥔", name: "a potato", quip: "Also lost. Be nice to it." },
    { emoji: "🗺️", name: "a map", quip: "It just says “you are here”. Thanks, map." },
    { emoji: "🐛", name: "a bug", quip: "Labelled “won't fix”." },
    { emoji: "📦", name: "node_modules", quip: "It goes all the way down. Put it back." },
];

// The last turnip in the patch always gives the same answer.
const LAST_FIND: Find = {
    emoji: "🕳️",
    name: "nothing at all",
    quip: "The page was the turnips we pulled along the way.",
};

const PLOTS = 6;

// Said when a pull doesn't get the turnip out: a nod to The Gigantic Turnip.
const STUCK = [
    "It won't budge.",
    "It wiggled a bit. Pull harder!",
    "Still stuck. The goat has been called for backup.",
    "Nearly! Put your back into it.",
];

// The more times a turnip has been pulled, the likelier it comes out. The
// third pull always works, so nobody is stuck tugging forever.
const POP_CHANCE = [0.35, 0.65, 1];

const shuffle = <T,>(items: T[]) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

interface Plot {
    tugs: number;
    find: Find | null;
}

// Every few seconds an untouched turnip fidgets, to hint that it can be pulled.
const IDLE_MOVES = ["rustle", "peek"] as const;
const IDLE_DELAY_MIN = 2500;
const IDLE_DELAY_SPREAD = 2500;
// A little longer than the idle animations in NotFound.scss.
const IDLE_DURATION = 1000;

interface Idle {
    index: number;
    move: (typeof IDLE_MOVES)[number];
}

const freshPatch = (): Plot[] => Array.from({ length: PLOTS }, () => ({ tugs: 0, find: null }));

const NotFound = () => {
    const [path, setPath] = useState("");
    const [plots, setPlots] = useState(freshPatch);
    const [deck, setDeck] = useState<Find[]>([]);
    const [message, setMessage] = useState("Nothing dug up yet.");
    const [idle, setIdle] = useState<Idle | null>(null);
    const patchRef = useRef<HTMLUListElement>(null);
    const reducedMotion = usePrefersReducedMotion();

    // Read by the idle timer, so it can keep running across pulls.
    const plotsRef = useRef(plots);
    useEffect(() => {
        plotsRef.current = plots;
    }, [plots]);

    // The static 404.html is served for every missing URL, so the path is
    // only known in the browser.
    useEffect(() => {
        try {
            setPath(decodeURIComponent(window.location.pathname));
        } catch {
            setPath(window.location.pathname);
        }
    }, []);

    // Only turnips nobody has touched fidget: a tugged one keeps its wobble
    // animation, and swapping it for an idle one would replay the wobble after.
    useEffect(() => {
        if (reducedMotion) return;
        let timer: ReturnType<typeof setTimeout>;
        const schedule = () => {
            timer = setTimeout(fidget, IDLE_DELAY_MIN + Math.random() * IDLE_DELAY_SPREAD);
        };
        const fidget = () => {
            const untouched = plotsRef.current.flatMap((plot, index) => (plot.tugs ? [] : [index]));
            if (untouched.length) {
                setIdle({
                    index: untouched[Math.floor(Math.random() * untouched.length)],
                    move: IDLE_MOVES[Math.floor(Math.random() * IDLE_MOVES.length)],
                });
                timer = setTimeout(() => {
                    setIdle(null);
                    schedule();
                }, IDLE_DURATION);
            } else {
                schedule();
            }
        };
        schedule();
        return () => {
            clearTimeout(timer);
            setIdle(null);
        };
    }, [reducedMotion]);

    const pulled = plots.filter((plot) => plot.find).length;
    const harvested = pulled === PLOTS;

    const pull = (index: number) => {
        const plot = plots[index];
        if (plot.find) {
            setMessage(`Still ${plot.find.name}. ${plot.find.quip}`);
            return;
        }

        // Random numbers only come from clicks, so the prerendered HTML and
        // the first client render always match.
        const popped = Math.random() < POP_CHANCE[Math.min(plot.tugs, POP_CHANCE.length - 1)];
        let find: Find | null = null;
        if (popped) {
            const cards = deck.length ? deck : shuffle(FINDS);
            find = pulled === PLOTS - 1 ? LAST_FIND : cards[pulled];
            if (!deck.length) setDeck(cards);
        }

        setPlots(plots.map((p, i) => (i === index ? { tugs: p.tugs + 1, find } : p)));
        setMessage(
            find
                ? `Pop! Under turnip ${index + 1}: ${find.name}. ${find.quip}`
                : STUCK[Math.floor(Math.random() * STUCK.length)]
        );
    };

    const replant = () => {
        setPlots(freshPatch());
        setDeck([]);
        setMessage("Replanted. Fresh turnips, same missing page.");
        // The replant button goes away, so keep keyboard focus in the patch.
        patchRef.current?.querySelector("button")?.focus();
    };

    return (
        <div className="not-found">
            <header className="not-found__header">
                <p className="not-found__code" aria-hidden="true">
                    4<Turnip className="not-found__code-turnip" />4
                </p>
                <h1 className="not-found__title">This page has gone to seed</h1>
                <p className="not-found__intro">
                    I looked everywhere for{" "}
                    {path ? <code className="not-found__path">{path}</code> : "that page"}, but there&apos;s
                    nothing here. Maybe it got buried in the turnip patch?
                </p>
                <nav className="not-found__links" aria-label="Ways out">
                    <TextLink href="/">Take me home</TextLink>
                    <TextLink href="/showcase">Things I made</TextLink>
                    <TextLink href="/contacts">Report a missing page</TextLink>
                </nav>
            </header>

            <section className="not-found__dig" aria-labelledby="not-found-dig-title">
                <h2 id="not-found-dig-title" className="not-found__subtitle">Have a dig</h2>
                <p className="not-found__hint">Pull the turnips to look underneath. Some take a few tries.</p>

                <ul className="not-found__patch" ref={patchRef}>
                    {plots.map((plot, index) => {
                        const classes = ["plot"];
                        if (plot.find) classes.push("plot--pulled");
                        // Alternate two identical animations so each pull restarts the wobble.
                        else if (plot.tugs) classes.push(plot.tugs % 2 ? "plot--tug-a" : "plot--tug-b");
                        else if (idle?.index === index) classes.push(`plot--idle-${idle.move}`);
                        return (
                            <li key={index} className={classes.join(" ")}>
                                <button
                                    type="button"
                                    className="plot__button"
                                    aria-label={
                                        plot.find
                                            ? `Turnip ${index + 1}: ${plot.find.name}`
                                            : `Pull turnip ${index + 1}`
                                    }
                                    onClick={() => pull(index)}
                                >
                                    <span className="plot__ground">
                                        <span className="plot__turnip">
                                            <Turnip className="plot__turnip-art" />
                                        </span>
                                    </span>
                                    <span className="plot__soil">
                                        {plot.find && <span className="plot__find">{plot.find.emoji}</span>}
                                    </span>
                                </button>
                                <p className="plot__caption" aria-hidden="true">
                                    {plot.find ? plot.find.name : " "}
                                </p>
                            </li>
                        );
                    })}
                </ul>

                <div className="not-found__report">
                    <p className="not-found__message" role="status">{message}</p>
                    <p className="not-found__tally">
                        Turnips pulled: {pulled} / {PLOTS}
                        {harvested && " · pages found: 0"}
                    </p>
                    {harvested && (
                        <button type="button" className="not-found__replant" onClick={replant}>
                            Replant the patch
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
};

export default NotFound;
