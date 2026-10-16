// The goat's behaviour as a pure reducer: every event carries the current
// time (and any randomness), so the logic can be tested without timers.

import type { GoatPose } from "./GoatAnimal";

export type Facing = "down" | "up" | "left" | "right";

export type GoatAction =
    | "idle"
    | "walk"      // player-driven: arrow key or control held down
    | "wander"    // strolling on its own to a random spot
    | "seek"      // heading for a turnip
    | "eat"
    | "sniff"     // too full to eat: sniffs the turnip and leaves it
    | "cuddle"
    | "nap"       // sleeps until its energy is full
    | "sleep"     // dozed off from boredom; lasts until woken
    | "jump"
    | "headbutt"
    | "bleat"
    | "yawn"      // too tired to jump or headbutt
    | "startled"; // woken up while asleep

export type Trick = "cuddle" | "nap" | "jump" | "headbutt" | "bleat";

export interface Point { x: number; y: number }

export interface GoatState {
    // Feet position in pen pixels.
    x: number;
    y: number;
    facing: Facing;
    action: GoatAction;
    // The current action began by itself (a wander, a hungry bleat), not
    // because of the visitor; screen readers aren't told about these.
    onItsOwn: boolean;
    // When the current timed action (or a tapped step) ends.
    until: number;
    heldDir: Facing | null;
    target: Point | null;
    turnip: Point | null;
    // The goat already sniffed this turnip while full; it waits until hungry.
    turnipSniffed: boolean;
    pen: { w: number; h: number };
    lastInput: number;
    nextWander: number;
    nextHungryBleat: number;
    // Last cuddle or play; happiness starts dropping when this gets old.
    lastCare: number;
    // Last jump that counted as play, so mashing Space doesn't farm happiness.
    lastPlay: number;
    // Bumped on every cuddle and play so the heart pop replays.
    hearts: number;
    cuddles: number;
    // The three needs, 0 to MAX. Fractional so they drain smoothly;
    // shown and compared as whole icons via level().
    happiness: number;
    fullness: number;
    energy: number;
    // What the visitor named the goat; empty for no name.
    name: string;
}

export interface SavedGoat {
    cuddles: number;
    happiness: number;
    fullness?: number;
    energy?: number;
    name?: string;
}

export type GoatEvent =
    | { type: "start"; now: number }
    | { type: "resize"; w: number; h: number }
    // elapsedMs: how long the page was closed since the save.
    | { type: "load"; saved: SavedGoat; elapsedMs: number }
    | { type: "tick"; now: number; dt: number; canWander: boolean; rand: [number, number, number] }
    | { type: "walk"; dir: Facing; now: number }
    | { type: "stopWalk"; dir: Facing; now: number }
    | { type: "step"; dir: Facing; now: number }
    | { type: "trick"; trick: Trick; now: number }
    | { type: "feed"; rand: [number, number]; now: number }
    | { type: "rename"; name: string };

export const SPEED = 70;             // px per second
export const MIN_STEP_MS = 300;      // a quick tap still walks a little
export const TAP_STEP_MS = 400;      // a control pressed from the keyboard
export const WANDER_AFTER_MS = 8000;
export const SLEEP_AFTER_MS = 30000;
export const TIRED_SLEEP_AFTER_MS = 10000;
export const SEEK_AFTER_MS = 1000;
export const MAX = 5;

// Seconds for each meter to move by one icon.
export const HUNGER_S = 120;         // fullness drains while awake...
export const SLEEP_HUNGER_S = 240;   // ...and slower while asleep
export const TIRE_S = 180;           // energy drains while awake
export const REST_S = 4;             // and comes back while asleep
export const SAD_S = 90;             // happiness drains once ignored...
export const CARE_GRACE_MS = 90000;  // ...for this long

export const MAX_NAME = 20;

// Single spaces, no leading or trailing ones, and not too long for the tag.
export const cleanName = (raw: string) => raw.replace(/\s+/g, " ").trim().slice(0, MAX_NAME).trim();

// Meters never drop below this while the page is closed.
export const OFFLINE_FLOOR = 2;

const MEAL = 2;
const CUDDLE_JOY = 1;
const PLAY_JOY = 0.5;
const PLAY_COOLDOWN_MS = 3000;
// What a trick costs.
const EFFORT: Partial<Record<Trick, { energy: number; fullness: number }>> = {
    jump: { energy: 0.25, fullness: 0.1 },
    headbutt: { energy: 0.35, fullness: 0.15 },
};

// The 32px sprite is drawn at 3x.
export const SCALE = 3;
// Half the goat's width, and how far its height reaches above its feet.
export const HALF_W = 16 * SCALE;
export const TOP = 30 * SCALE;
// Muzzle distance from the goat's centre when side-on.
export const MUZZLE = 14 * SCALE;

const DURATION: Record<Trick | "eat" | "sniff" | "yawn" | "startled", number> = {
    cuddle: 1500,
    nap: 5000,       // at least; it then sleeps on until its energy is full
    jump: 600,
    headbutt: 600,
    bleat: 900,
    eat: 2000,
    sniff: 1200,
    yawn: 1200,
    startled: 600,
};

const STEP: Record<Facing, Point> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
};

export const initialGoat = (w = 340, h = 240): GoatState => ({
    x: w / 2,
    y: h * 0.7,
    facing: "down",
    action: "idle",
    onItsOwn: false,
    until: 0,
    heldDir: null,
    target: null,
    turnip: null,
    turnipSniffed: false,
    pen: { w, h },
    lastInput: 0,
    nextWander: 0,
    nextHungryBleat: 0,
    lastCare: 0,
    lastPlay: -Infinity,
    hearts: 0,
    cuddles: 0,
    happiness: 3,
    fullness: 4,
    energy: 4,
    name: "",
});

// A meter as whole icons.
export const level = (v: number) => Math.round(v);
export const isHungry = (s: GoatState) => level(s.fullness) <= 1;
export const isTired = (s: GoatState) => level(s.energy) <= 1;
export const isFull = (s: GoatState) => level(s.fullness) >= MAX;
export const isAsleep = (s: GoatState) => s.action === "sleep" || s.action === "nap";

const clamp = (v: number) => Math.min(MAX, Math.max(0, v));
const clampX = (s: GoatState, x: number) => Math.min(Math.max(x, HALF_W), s.pen.w - HALF_W);
const clampY = (s: GoatState, y: number) => Math.min(Math.max(y, TOP), s.pen.h - 4);
const speed = (s: GoatState) => (isTired(s) ? SPEED / 2 : SPEED);

// Joy counts for half when the goat is hungry or tired.
const happier = (s: GoatState, by: number, now: number): GoatState => ({
    ...s,
    happiness: clamp(s.happiness + (isHungry(s) || isTired(s) ? by / 2 : by)),
    lastCare: now,
    hearts: s.hearts + 1,
});

// Where the goat stands to eat: beside the turnip, muzzle over its leaves,
// one pixel lower so it's drawn in front.
export const eatingSpot = (s: GoatState, t: Point): Point => {
    const fromLeft = s.x <= t.x;
    return { x: clampX(s, fromLeft ? t.x - MUZZLE : t.x + MUZZLE), y: clampY(s, t.y + 1) };
};

// Random spot for a turnip, far enough from the walls for the goat to reach either side.
export const turnipSpot = (s: GoatState, rx: number, ry: number): Point => ({
    x: HALF_W + MUZZLE + rx * Math.max(0, s.pen.w - 2 * (HALF_W + MUZZLE)),
    y: TOP + 20 + ry * Math.max(0, s.pen.h - TOP - 28),
});

// Walks along x first, then y, so the goat always faces one of its four directions.
const moveToward = (s: GoatState, target: Point, dist: number): { s: GoatState; arrived: boolean } => {
    const dx = target.x - s.x;
    const dy = target.y - s.y;
    if (Math.abs(dx) > 0.5) {
        const move = Math.min(dist, Math.abs(dx)) * Math.sign(dx);
        return { s: { ...s, x: s.x + move, facing: dx > 0 ? "right" : "left" }, arrived: false };
    }
    if (Math.abs(dy) > 0.5) {
        const move = Math.min(dist, Math.abs(dy)) * Math.sign(dy);
        return { s: { ...s, x: target.x, y: s.y + move, facing: dy > 0 ? "down" : "up" }, arrived: false };
    }
    return { s: { ...s, x: target.x, y: target.y }, arrived: true };
};

const idle = (s: GoatState): GoatState => ({ ...s, action: "idle", onItsOwn: false, until: 0, heldDir: null, target: null });

const startled = (s: GoatState, now: number): GoatState => ({
    ...s,
    action: "startled",
    onItsOwn: false,
    until: now + DURATION.startled,
    heldDir: null,
    target: null,
    lastInput: now,
});

// Hunger, tiredness and loneliness creep up; sleep restores energy.
const drain = (s: GoatState, now: number, dt: number): GoatState => {
    const asleep = isAsleep(s);
    return {
        ...s,
        fullness: clamp(s.fullness - dt / (asleep ? SLEEP_HUNGER_S : HUNGER_S)),
        energy: clamp(asleep ? s.energy + dt / REST_S : s.energy - dt / TIRE_S),
        happiness: now - s.lastCare > CARE_GRACE_MS ? clamp(s.happiness - dt / SAD_S) : s.happiness,
    };
};

const tick = (state: GoatState, e: Extract<GoatEvent, { type: "tick" }>): GoatState => {
    const { now, dt } = e;
    const s = drain(state, now, dt);

    // Out of energy: it lies down wherever it is, unless it's mid-meal.
    if (s.energy <= 0 && !isAsleep(s) && s.action !== "eat") {
        return { ...idle(s), action: "nap", facing: "down", until: now };
    }

    switch (s.action) {
        case "walk": {
            if (!s.heldDir && now >= s.until) return idle(s);
            const step = STEP[s.facing];
            const dist = speed(s) * dt;
            return { ...s, x: clampX(s, s.x + step.x * dist), y: clampY(s, s.y + step.y * dist) };
        }
        case "wander":
        case "seek": {
            if (!s.target) return idle(s);
            // Wandering was switched off mid-stroll: stop where it is.
            if (s.action === "wander" && !e.canWander) return idle(s);
            const moved = moveToward(s, s.target, speed(s) * dt);
            if (!moved.arrived) return moved.s;
            if (s.action === "wander" || !s.turnip) return idle(moved.s);
            const atTurnip: GoatState = {
                ...moved.s,
                facing: moved.s.x < s.turnip.x ? "right" : "left",
                target: null,
            };
            return isFull(s)
                ? { ...atTurnip, action: "sniff", until: now + DURATION.sniff, turnipSniffed: true }
                : { ...atTurnip, action: "eat", until: now + DURATION.eat };
        }
        case "eat":
            if (now < s.until) return s;
            return idle({ ...s, fullness: clamp(s.fullness + MEAL), turnip: null, turnipSniffed: false });
        case "nap":
            // Sleeps at least the nap's length, then on until rested.
            return now >= s.until && s.energy >= MAX ? idle(s) : s;
        case "sleep":
            return s;
        case "idle": {
            if (s.turnip && !(isFull(s) && s.turnipSniffed) && now - s.lastInput > SEEK_AFTER_MS) {
                return { ...s, action: "seek", target: eatingSpot(s, s.turnip) };
            }
            if (isHungry(s) && now >= s.nextHungryBleat) {
                return {
                    ...s,
                    action: "bleat",
                    onItsOwn: true,
                    until: now + DURATION.bleat,
                    nextHungryBleat: now + 15000 + e.rand[2] * 10000,
                };
            }
            const idleFor = now - s.lastInput;
            if (idleFor > (isTired(s) ? TIRED_SLEEP_AFTER_MS : SLEEP_AFTER_MS)) {
                return { ...s, action: "sleep", facing: "down", until: 0 };
            }
            if (e.canWander && idleFor > WANDER_AFTER_MS && now >= s.nextWander) {
                const [rx, ry, rw] = e.rand;
                return {
                    ...s,
                    action: "wander",
                    onItsOwn: true,
                    target: {
                        x: HALF_W + rx * (s.pen.w - 2 * HALF_W),
                        y: TOP + ry * (s.pen.h - 4 - TOP),
                    },
                    nextWander: now + 4000 + rw * 4000,
                };
            }
            return s;
        }
        default:
            // Timed actions: cuddle, jump, headbutt, bleat, yawn, sniff, startled.
            return now >= s.until ? idle(s) : s;
    }
};

// Time passes while the page is closed, but the goat never ends up below
// OFFLINE_FLOOR from that alone: visitors come back to a peckish goat, not a sad one.
const afterAbsence = (v: number, lost: number) => (v <= OFFLINE_FLOOR ? v : Math.max(OFFLINE_FLOOR, v - lost));

// A save is only as trustworthy as the browser storage it came from.
const num = (v: unknown, fallback: number) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

const trick = (s: GoatState, e: Extract<GoatEvent, { type: "trick" }>): GoatState => {
    const now = e.now;
    if (isAsleep(s)) return startled(s, now);

    const base: GoatState = { ...s, onItsOwn: false, heldDir: null, target: null, lastInput: now };
    const effort = EFFORT[e.trick];
    if (effort && isTired(s)) {
        return { ...base, action: "yawn", until: now + DURATION.yawn };
    }

    let next: GoatState = { ...base, action: e.trick, until: now + DURATION[e.trick] };
    if (effort) {
        next = {
            ...next,
            energy: clamp(next.energy - effort.energy),
            fullness: clamp(next.fullness - effort.fullness),
        };
    }
    switch (e.trick) {
        case "cuddle":
            return { ...happier(next, CUDDLE_JOY, now), cuddles: s.cuddles + 1 };
        case "nap":
            return { ...next, facing: "down" };
        case "jump":
            return now - s.lastPlay >= PLAY_COOLDOWN_MS ? { ...happier(next, PLAY_JOY, now), lastPlay: now } : next;
        case "headbutt":
            // Headbutts happen side-on.
            return s.facing === "up" || s.facing === "down" ? { ...next, facing: "right" } : next;
        default:
            return next;
    }
};

export const goatReducer = (s: GoatState, e: GoatEvent): GoatState => {
    switch (e.type) {
        case "start":
            return { ...s, lastInput: e.now, lastCare: e.now, nextWander: e.now, nextHungryBleat: e.now };
        case "resize": {
            const sized = { ...s, pen: { w: e.w, h: e.h } };
            return {
                ...sized,
                x: clampX(sized, s.x),
                y: clampY(sized, s.y),
                turnip: s.turnip && {
                    x: Math.min(Math.max(s.turnip.x, HALF_W + MUZZLE), Math.max(HALF_W + MUZZLE, e.w - HALF_W - MUZZLE)),
                    y: clampY(sized, s.turnip.y),
                },
                target: null,
                ...(s.action === "wander" || s.action === "seek" ? { action: "idle", onItsOwn: false } : {}),
            };
        }
        case "load": {
            const { saved, elapsedMs } = e;
            const away = num(elapsedMs, 0);
            const secs = Math.max(0, away) / 1000;
            const lonely = Math.max(0, away - CARE_GRACE_MS) / 1000;
            return {
                ...s,
                cuddles: Math.max(0, Math.floor(num(saved.cuddles, s.cuddles))),
                happiness: afterAbsence(clamp(num(saved.happiness, s.happiness)), lonely / SAD_S),
                fullness: afterAbsence(clamp(num(saved.fullness, s.fullness)), secs / HUNGER_S),
                energy: afterAbsence(clamp(num(saved.energy, s.energy)), secs / TIRE_S),
                name: typeof saved.name === "string" ? cleanName(saved.name) : s.name,
            };
        }
        case "tick":
            return tick(s, e);
        case "walk":
            if (isAsleep(s)) return startled(s, e.now);
            return {
                ...s,
                action: "walk",
                onItsOwn: false,
                facing: e.dir,
                heldDir: e.dir,
                until: e.now + MIN_STEP_MS,
                target: null,
                lastInput: e.now,
            };
        case "stopWalk":
            if (s.action !== "walk" || s.heldDir !== e.dir) return s;
            return { ...s, heldDir: null, lastInput: e.now };
        case "step":
            if (isAsleep(s)) return startled(s, e.now);
            return {
                ...s,
                action: "walk",
                onItsOwn: false,
                facing: e.dir,
                heldDir: null,
                until: e.now + TAP_STEP_MS,
                target: null,
                lastInput: e.now,
            };
        case "trick":
            return trick(s, e);
        case "feed": {
            if (s.turnip) return s;
            const fed = { ...s, turnip: turnipSpot(s, ...e.rand), turnipSniffed: false };
            return isAsleep(s) ? startled(fed, e.now) : { ...fed, lastInput: e.now };
        }
        case "rename":
            return { ...s, name: cleanName(e.name) };
    }
};

// Which sprite row to show, and whether it animates.
export const poseOf = (s: GoatState): { pose: GoatPose; moving: boolean } => {
    switch (s.action) {
        case "walk":
        case "wander":
        case "seek":
            return { pose: s.facing, moving: true };
        case "idle":
            return { pose: s.facing, moving: false };
        case "cuddle":
            return { pose: "cuddle", moving: true };
        case "nap":
        case "sleep":
            return { pose: "sleep", moving: true };
        case "jump":
        case "startled":
            return { pose: "jump", moving: true };
        case "headbutt":
            return { pose: s.facing === "left" ? "headbutt-left" : "headbutt-right", moving: true };
        case "eat":
            return { pose: s.facing === "left" ? "eat-left" : "eat-right", moving: true };
        case "sniff":
            // Head down over the turnip, but not chewing.
            return { pose: s.facing === "left" ? "eat-left" : "eat-right", moving: false };
        case "bleat":
        case "yawn":
            return { pose: "bleat", moving: true };
    }
};

// "The goat", or its name.
export const nameOf = (s: GoatState) => s.name || "The goat";

const FACING_WORD: Record<Facing, string> = { down: "down", up: "up", left: "left", right: "right" };

// What a screen reader hears when the goat changes what it's doing.
export const statusOf = (s: GoatState): string => {
    const who = nameOf(s);
    switch (s.action) {
        case "idle":
            return s.facing === "down" ? `${who} is facing you.` : `${who} stands still, facing ${FACING_WORD[s.facing]}.`;
        case "walk":
            return `${who} walks ${FACING_WORD[s.facing]}.`;
        case "wander":
            return `${who} wanders around the pen.`;
        case "seek":
            return `${who} trots over to the turnip.`;
        case "eat":
            return `${who} munches the turnip. Yum!`;
        case "sniff":
            return `${who} sniffs the turnip, but it's too full. It leaves it for later.`;
        case "cuddle":
            return `${who} enjoys a cuddle!`;
        case "nap":
            return `${who} is taking a nap.`;
        case "sleep":
            return `${who} dozed off. Cuddle it to wake it up.`;
        case "jump":
            return `${who} jumps!`;
        case "headbutt":
            return `${who} headbutts the air!`;
        case "bleat":
            return isHungry(s) ? `${who} bleats for food: Meeeh!` : `${who} bleats: Meeeh!`;
        case "yawn":
            return `${who} is too tired for that and yawns.`;
        case "startled":
            return `${who} wakes up with a start!`;
    }
};

// What the status live region says: only what the visitor caused. Standing
// still says nothing, so a second cuddle or jump is announced afresh.
export const announcementOf = (s: GoatState): string =>
    s.onItsOwn || s.action === "idle" ? "" : statusOf(s);

// Announced separately, only when the goat's needs change.
export const needsOf = (s: GoatState): string => {
    const who = nameOf(s);
    const hungry = isHungry(s);
    const tired = isTired(s);
    if (hungry && tired) return `${who} is hungry and sleepy.`;
    if (hungry) return `${who}'s tummy rumbles. It's hungry!`;
    if (tired) return `${who} is getting sleepy.`;
    return "";
};
