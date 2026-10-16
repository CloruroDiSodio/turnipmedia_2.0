"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import type { PointerEvent, MouseEvent, ReactNode } from "react";
import {
    MdKeyboardArrowUp,
    MdKeyboardArrowDown,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdAdsClick,
    MdVolumeUp,
    MdVolumeOff,
} from "react-icons/md";
import './GoatPage.scss';
import { GoatAnimal } from "./GoatAnimal";
import {
    goatReducer,
    initialGoat,
    isAsleep,
    isHungry,
    level,
    needsOf,
    poseOf,
    statusOf,
    MAX,
    MAX_NAME,
    SCALE,
    cleanName,
} from "./goatState";
import type { Facing, GoatState, SavedGoat, Trick } from "./goatState";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { playBleat } from "./bleat";

const TICK_MS = 50;
const SAVE_MS = 5000;
const STORAGE_KEY = "goat-companion";
// Feet sit near the bottom of the sprite; the turnip's base near the bottom of its tile.
const SPRITE = 32 * SCALE;
const FEET = 31 * SCALE;
const TURNIP = 16 * SCALE;
const TURNIP_BASE = 15 * SCALE;

const ARROW_KEYS: Record<string, Facing> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
};

const TRICK_KEYS: Record<string, Trick> = {
    c: "cuddle",
    s: "nap",
    " ": "jump",
    h: "headbutt",
    b: "bleat",
};

const WALK_CONTROLS: { dir: Facing; label: string; icon: ReactNode }[] = [
    { dir: "left", label: "Walk left", icon: <MdKeyboardArrowLeft aria-hidden="true" /> },
    { dir: "up", label: "Walk up", icon: <MdKeyboardArrowUp aria-hidden="true" /> },
    { dir: "down", label: "Walk down", icon: <MdKeyboardArrowDown aria-hidden="true" /> },
    { dir: "right", label: "Walk right", icon: <MdKeyboardArrowRight aria-hidden="true" /> },
];

const METERS: { key: "happiness" | "fullness" | "energy"; label: string; icon: string; unit: string }[] = [
    { key: "happiness", label: "Happiness", icon: "heart", unit: "hearts" },
    { key: "fullness", label: "Fullness", icon: "turnip", unit: "turnips" },
    { key: "energy", label: "Energy", icon: "z", unit: "Zs" },
];

const save = (g: GoatState) => {
    try {
        const saved: SavedGoat & { savedAt: number } = {
            cuddles: g.cuddles,
            happiness: g.happiness,
            fullness: g.fullness,
            energy: g.energy,
            name: g.name,
            savedAt: Date.now(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
        // Storage blocked: the goat just forgets.
    }
};

const GoatPage = () => {
    const [goat, dispatch] = useReducer(goatReducer, undefined, () => initialGoat());
    const [soundOn, setSoundOn] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const reducedMotion = usePrefersReducedMotion();
    const reducedMotionRef = useRef(reducedMotion);
    reducedMotionRef.current = reducedMotion;
    const heldRef = useRef(goat.heldDir);
    heldRef.current = goat.heldDir;
    const goatRef = useRef(goat);
    goatRef.current = goat;
    const penRef = useRef<HTMLDivElement>(null);

    const trick = (t: Trick) => dispatch({ type: "trick", trick: t, now: performance.now() });
    const feed = () => dispatch({ type: "feed", rand: [Math.random(), Math.random()], now: performance.now() });
    const walk = (dir: Facing) => dispatch({ type: "walk", dir, now: performance.now() });
    const stopWalk = (dir: Facing) => dispatch({ type: "stopWalk", dir, now: performance.now() });

    // One clock drives walking, wandering, and the end of every timed action.
    useEffect(() => {
        let last = performance.now();
        dispatch({ type: "start", now: last });
        const id = window.setInterval(() => {
            const now = performance.now();
            dispatch({
                type: "tick",
                now,
                // A background tab throttles timers; don't teleport on return.
                dt: Math.min((now - last) / 1000, 0.1),
                // Wandering is motion nobody asked for, so it's off under reduced motion.
                canWander: !reducedMotionRef.current,
                rand: [Math.random(), Math.random(), Math.random()],
            });
            last = now;
        }, TICK_MS);
        return () => window.clearInterval(id);
    }, []);

    // The pen fills its column, so the goat's bounds follow its size.
    useEffect(() => {
        const pen = penRef.current;
        if (!pen) return;
        const measure = () => {
            if (pen.clientWidth > 0) dispatch({ type: "resize", w: pen.clientWidth, h: pen.clientHeight });
        };
        measure();
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(measure);
        observer.observe(pen);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            // Typing the goat's name: letters and arrows belong to the text field.
            if (e.target instanceof HTMLElement && (e.target.closest("input, textarea, select") || e.target.isContentEditable)) {
                return;
            }
            const dir = ARROW_KEYS[e.key];
            if (dir) {
                e.preventDefault();
                if (!e.repeat) walk(dir);
                return;
            }
            const key = e.key.toLowerCase();
            // Space on a focused button should press that button, not jump.
            const onControl = e.target instanceof Element && e.target.closest("button, a");
            if (key === " " && onControl) return;
            if (key === " ") e.preventDefault();
            if (e.repeat) return;
            if (key === "f") feed();
            const t = TRICK_KEYS[key];
            if (t) trick(t);
        };
        const onKeyUp = (e: KeyboardEvent) => {
            const dir = ARROW_KEYS[e.key];
            if (dir) stopWalk(dir);
        };
        // A key released while the window is in the background never fires keyup.
        const onBlur = () => {
            if (heldRef.current) stopWalk(heldRef.current);
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("blur", onBlur);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("blur", onBlur);
        };
    }, []);

    // The goat's needs survive a reload, in this browser only. Time away
    // counts too (see afterAbsence in goatState.ts).
    useEffect(() => {
        try {
            const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
            if (typeof saved?.cuddles === "number" && typeof saved?.happiness === "number") {
                const elapsedMs = typeof saved.savedAt === "number" ? Date.now() - saved.savedAt : 0;
                dispatch({ type: "load", saved, elapsedMs });
            }
        } catch {
            // Storage blocked or corrupted: start fresh.
        }
        setLoaded(true);
    }, []);

    // The meters change every tick, so save every few seconds and on leaving,
    // not on every change.
    useEffect(() => {
        if (!loaded) return;
        const saveNow = () => save(goatRef.current);
        const onHide = () => {
            if (document.visibilityState === "hidden") saveNow();
        };
        saveNow();
        const id = window.setInterval(saveNow, SAVE_MS);
        window.addEventListener("pagehide", saveNow);
        document.addEventListener("visibilitychange", onHide);
        return () => {
            window.clearInterval(id);
            window.removeEventListener("pagehide", saveNow);
            document.removeEventListener("visibilitychange", onHide);
            saveNow();
        };
    }, [loaded]);

    useEffect(() => {
        if (goat.action === "bleat" && soundOn) playBleat();
    }, [goat.action, goat.until, soundOn]);

    const { pose, moving } = poseOf(goat);
    const asleep = isAsleep(goat);
    // A turnip daydream when hungry, unless it's already dealing with food.
    const daydream =
        isHungry(goat) && !asleep && !["eat", "seek", "bleat", "yawn", "startled"].includes(goat.action);
    // Restart one-shot animations (a second jump, a second bleat) from frame 0.
    const playKey = goat.action === "walk" || goat.action === "idle" ? goat.action : `${goat.action}-${goat.until}`;

    // Walk controls: hold to keep walking. A press from the keyboard (detail 0)
    // has no pointer events, so it takes a single step instead.
    const walkHandlers = (dir: Facing) => ({
        onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
            e.currentTarget.setPointerCapture?.(e.pointerId);
            walk(dir);
        },
        onPointerUp: () => stopWalk(dir),
        onPointerCancel: () => stopWalk(dir),
        onLostPointerCapture: () => stopWalk(dir),
        onContextMenu: (e: MouseEvent) => e.preventDefault(),
        onClick: (e: MouseEvent) => {
            if (e.detail === 0) dispatch({ type: "step", dir, now: performance.now() });
        },
    });

    const key = (label: string, onPress: () => void, cap: ReactNode) => (
        <button type="button" className="key" aria-label={label} onClick={onPress}>
            <kbd>{cap}</kbd>
        </button>
    );

    return (
        <main className="goatPage">
            <div className="game-layout">
                {/* Goat Display Section */}
                <div className="goat-section">
                    <h1 className="h3">GOAT COMPANION</h1>
                    {/* Pen and meters: pinned to the top on phones while the controls scroll. */}
                    <div className="goat-stage">
                        <div className="pen" ref={penRef}>
                            {goat.turnip && (
                                <span
                                    className="prop prop--turnip turnip"
                                    aria-hidden="true"
                                    style={{
                                        left: Math.round(goat.turnip.x - TURNIP / 2),
                                        top: Math.round(goat.turnip.y - TURNIP_BASE),
                                        zIndex: Math.round(goat.turnip.y),
                                    }}
                                />
                            )}
                            <div
                                className={`goat goat--${goat.action} goat--facing-${goat.facing}`}
                                // Whole pixels: a fractional offset blurs the pixel art.
                                style={{
                                    left: Math.round(goat.x - SPRITE / 2),
                                    top: Math.round(goat.y - FEET),
                                    zIndex: Math.round(goat.y),
                                }}
                            >
                                {goat.hearts > 0 && (
                                    <span key={goat.hearts} className="prop prop--heart heart-pop" aria-hidden="true" />
                                )}
                                {asleep && (
                                    <span className="zzz" aria-hidden="true">
                                        <span className="prop prop--z" />
                                        <span className="prop prop--z" />
                                        <span className="prop prop--z" />
                                    </span>
                                )}
                                {goat.action === "startled" && (
                                    <span className="prop prop--bang bang" aria-hidden="true" />
                                )}
                                {goat.action === "bleat" && (
                                    <span className="speech" aria-hidden="true">Meeeh!</span>
                                )}
                                {goat.action === "yawn" && (
                                    <span className="speech" aria-hidden="true">Yaawn…</span>
                                )}
                                {daydream && (
                                    <span className="thought" aria-hidden="true">
                                        <span className="prop prop--turnip" />
                                    </span>
                                )}
                                <button
                                    type="button"
                                    className="goat-button"
                                    aria-label={`Cuddle ${goat.name || "the goat"}${asleep ? " (asleep)" : ""}`}
                                    onClick={() => trick("cuddle")}
                                >
                                    <GoatAnimal key={playKey} pose={pose} moving={moving} size={SPRITE} />
                                </button>
                            </div>
                        </div>
                        {/* Announces what the goat is doing to screen readers. */}
                        <p className="visually-hidden" aria-live="polite">
                            {statusOf(goat)}
                        </p>
                        {/* Speaks up only when the goat gets hungry or sleepy. */}
                        <p className="visually-hidden" aria-live="polite">
                            {needsOf(goat)}
                        </p>
                        <div className="goat-stats">
                            <div className="meters">
                                {METERS.map(({ key: meter, label, icon, unit }) => {
                                    const value = level(goat[meter]);
                                    return (
                                        <p key={meter} className="meter">
                                            <span className="meter-label">{label}</span>
                                            <span
                                                className="meter-icons"
                                                role="img"
                                                aria-label={`${label}: ${value} of ${MAX} ${unit}`}
                                            >
                                                {Array.from({ length: MAX }, (_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`prop prop--${icon}${i < value ? "" : " is-empty"}`}
                                                    />
                                                ))}
                                            </span>
                                        </p>
                                    );
                                })}
                            </div>
                            <p>
                                {goat.name && <span className="name-tag">{goat.name}</span>}
                                Cuddles given: {goat.cuddles}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Controls Card */}
                <div className="instructions-card">
                    <h2 className="h4">Controls</h2>
                    <ul>
                        <li>
                            <div className="keys">
                                {WALK_CONTROLS.map(({ dir, label, icon }) => (
                                    <button
                                        key={dir}
                                        type="button"
                                        className="key key--hold"
                                        aria-label={label}
                                        {...walkHandlers(dir)}
                                    >
                                        <kbd>{icon}</kbd>
                                    </button>
                                ))}
                            </div>
                            <span>Walk (hold)</span>
                        </li>
                        <li>
                            <div className="keys">
                                {key("Cuddle (C)", () => trick("cuddle"), "C")} /{" "}
                                {key("Cuddle", () => trick("cuddle"), <MdAdsClick aria-hidden="true" />)}
                            </div>
                            <span>Cuddle</span>
                        </li>
                        <li>
                            <div className="keys">{key("Feed a turnip (F)", feed, "F")}</div>
                            <span>Feed a turnip</span>
                        </li>
                        <li>
                            <div className="keys">{key("Jump (Space)", () => trick("jump"), "Space")}</div>
                            <span>Jump</span>
                        </li>
                        <li>
                            <div className="keys">{key("Headbutt (H)", () => trick("headbutt"), "H")}</div>
                            <span>Headbutt</span>
                        </li>
                        <li>
                            <div className="keys">{key("Bleat (B)", () => trick("bleat"), "B")}</div>
                            <span>Bleat</span>
                        </li>
                        <li>
                            <div className="keys">{key("Take a nap (S)", () => trick("nap"), "S")}</div>
                            <span>Take a nap</span>
                        </li>
                        <li>
                            <div className="keys">
                                <button
                                    type="button"
                                    className="key"
                                    aria-label="Bleat sound"
                                    aria-pressed={soundOn}
                                    onClick={() => setSoundOn((on) => !on)}
                                >
                                    <kbd>
                                        {soundOn ? <MdVolumeUp aria-hidden="true" /> : <MdVolumeOff aria-hidden="true" />}
                                    </kbd>
                                </button>
                            </div>
                            <span>Sound {soundOn ? "on" : "off"}</span>
                        </li>
                    </ul>
                    <NameForm name={goat.name} onRename={(name) => dispatch({ type: "rename", name })} />
                    <p className="note">
                        <b>Tap the icons</b> or use your keyboard!<br />
                        Cuddles and jumps make {goat.name || "the goat"} happy, turnips fill it up and naps restore its energy.
                        A tired goat won&apos;t do tricks. Left alone, it wanders off, then dozes.
                    </p>
                </div>
            </div>
        </main>
    );
};

interface NameFormProps {
    name: string;
    onRename: (name: string) => void;
}

const NameForm = ({ name, onRename }: NameFormProps) => {
    const [draft, setDraft] = useState(name);
    const [message, setMessage] = useState("");

    // A saved name loads after the first render; show it once it arrives.
    useEffect(() => setDraft(name), [name]);

    return (
        <form
            className="name-form"
            onSubmit={(e) => {
                e.preventDefault();
                const clean = cleanName(draft);
                onRename(clean);
                setDraft(clean);
                setMessage(clean ? `Your goat is now called ${clean}.` : "Your goat has no name.");
            }}
        >
            <h2 className="h4">Name your goat</h2>
            <label htmlFor="goat-name">Name</label>
            <div className="name-row">
                <input
                    id="goat-name"
                    type="text"
                    value={draft}
                    maxLength={MAX_NAME}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="e.g. Biscuit"
                    onChange={(e) => {
                        setDraft(e.target.value);
                        setMessage("");
                    }}
                />
                <button type="submit" className="name-save">Save</button>
            </div>
            <p className="name-message" aria-live="polite">{message}</p>
        </form>
    );
};

export default GoatPage;
