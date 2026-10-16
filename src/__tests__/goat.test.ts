import {
    cleanName,
    goatReducer,
    initialGoat,
    isHungry,
    level,
    needsOf,
    poseOf,
    statusOf,
    HALF_W,
    HUNGER_S,
    MAX,
    MAX_NAME,
    OFFLINE_FLOOR,
    SLEEP_AFTER_MS,
    TIRED_SLEEP_AFTER_MS,
    WANDER_AFTER_MS,
} from "../components/pages/Goat/goatState";
import type { GoatEvent, GoatState } from "../components/pages/Goat/goatState";

const started = (overrides: Partial<GoatState> = {}) =>
    goatReducer({ ...initialGoat(320, 200), ...overrides }, { type: "start", now: 0 });

const tick = (s: GoatState, now: number, canWander = true): GoatState =>
    goatReducer(s, { type: "tick", now, dt: 0.05, canWander, rand: [0.5, 0.5, 0.5] });

// Ticks every 50ms from `from` to `to`.
const run = (s: GoatState, from: number, to: number, canWander = true) => {
    for (let now = from; now <= to; now += 50) s = tick(s, now, canWander);
    return s;
};

const send = (s: GoatState, e: GoatEvent) => goatReducer(s, e);
const trick = (s: GoatState, t: "cuddle" | "nap" | "jump" | "headbutt" | "bleat", now: number) =>
    send(s, { type: "trick", trick: t, now });

describe("moving around", () => {
    test("holding an arrow walks the goat until it reaches the fence", () => {
        let s = send(started(), { type: "walk", dir: "left", now: 0 });
        s = run(s, 50, 5000);
        expect(s.action).toBe("walk");
        expect(s.facing).toBe("left");
        expect(s.x).toBe(HALF_W);
        expect(poseOf(s)).toEqual({ pose: "left", moving: true });

        s = send(s, { type: "stopWalk", dir: "left", now: 5000 });
        s = run(s, 5050, 5500);
        expect(s.action).toBe("idle");
    });

    test("a quick tap still walks a few steps", () => {
        const start = started();
        let s = send(start, { type: "walk", dir: "right", now: 0 });
        s = send(s, { type: "stopWalk", dir: "right", now: 10 });
        s = run(s, 50, 1000);
        expect(s.action).toBe("idle");
        expect(s.x).toBeGreaterThan(start.x + 10);
    });

    test("a tired goat walks at half speed", () => {
        const fresh = run(send(started(), { type: "walk", dir: "right", now: 0 }), 50, 500);
        const tired = run(send(started({ energy: 1 }), { type: "walk", dir: "right", now: 0 }), 50, 500);
        const start = started().x;
        expect(tired.x - start).toBeCloseTo((fresh.x - start) / 2, 0);
    });

    test("left alone, the goat wanders, then falls asleep", () => {
        let s = run(started(), 50, WANDER_AFTER_MS + 100);
        expect(s.action).toBe("wander");

        s = run(s, WANDER_AFTER_MS + 150, SLEEP_AFTER_MS + 2000);
        expect(s.action).toBe("sleep");
        expect(poseOf(s).pose).toBe("sleep");
    });

    test("a tired goat dozes off sooner", () => {
        const s = run(started({ energy: 1 }), 50, TIRED_SLEEP_AFTER_MS + 100, false);
        expect(s.action).toBe("sleep");
    });

    test("it doesn't wander when motion is reduced", () => {
        const s = run(started(), 50, WANDER_AFTER_MS + 2000, false);
        expect(s.action).toBe("idle");
    });
});

describe("happiness", () => {
    test("cuddles count up and make the goat happier, up to the max", () => {
        let s = started();
        for (let i = 0; i < 10; i++) s = trick(s, "cuddle", i * 2000);
        expect(s.cuddles).toBe(10);
        expect(s.happiness).toBe(MAX);
        expect(s.hearts).toBe(10);
    });

    test("cuddles count for half when the goat is hungry", () => {
        const s = trick(started({ fullness: 1, happiness: 2 }), "cuddle", 0);
        expect(s.happiness).toBe(2.5);
    });

    test("jumping is play, but mashing it doesn't count extra", () => {
        let s = started({ happiness: 2 });
        s = trick(s, "jump", 0);
        s = trick(s, "jump", 700);
        s = trick(s, "jump", 1400);
        expect(s.happiness).toBe(2.5);
        s = trick(s, "jump", 3100);
        expect(s.happiness).toBe(3);
    });

    test("cuddling a sleeping goat startles it instead", () => {
        let s = trick(started(), "nap", 0);
        s = trick(s, "cuddle", 1000);
        expect(s.action).toBe("startled");
        expect(s.cuddles).toBe(0);

        s = run(s, 1050, 2000);
        expect(s.action).toBe("idle");
    });

    test("happiness fades once the goat has been ignored for a while", () => {
        let s = started({ happiness: 3 });
        s = run(s, 50, 89_000, false);
        expect(s.happiness).toBe(3);
        s = run(s, 89_050, 140_000, false);
        expect(s.happiness).toBeLessThan(3);
    });
});

describe("hunger", () => {
    test("the goat walks to a turnip and eats it", () => {
        let s = send(started({ fullness: 2 }), { type: "feed", rand: [0.9, 0.9], now: 0 });
        const turnip = s.turnip!;

        s = run(s, 50, 1500);
        expect(s.action).toBe("seek");

        s = run(s, 1550, 8000);
        expect(s.turnip).toBeNull();
        expect(level(s.fullness)).toBe(4);
        // It approached from the left, so it ate facing right, muzzle over the turnip.
        expect(s.facing).toBe("right");
        expect(s.x).toBeLessThan(turnip.x);
    });

    test("a full goat sniffs the turnip and leaves it for later", () => {
        let s = send(started({ fullness: 5 }), { type: "feed", rand: [0.9, 0.9], now: 0 });
        let sniffed = false;
        for (let now = 50; now <= 8000; now += 50) {
            s = tick(s, now, false);
            if (s.action === "sniff") sniffed = true;
        }
        expect(sniffed).toBe(true);
        expect(s.turnip).not.toBeNull();
        expect(s.action).not.toBe("seek");

        // Once it's peckish again, it goes back for it.
        s = run({ ...s, fullness: 3, lastInput: 8000 }, 8050, 16000, false);
        expect(s.turnip).toBeNull();
    });

    test("fullness drains over time, slower while asleep", () => {
        // Held walking keeps it awake for the whole stretch.
        const awake = run(send(started({ fullness: 3 }), { type: "walk", dir: "up", now: 0 }), 50, HUNGER_S * 1000, false);
        expect(awake.fullness).toBeCloseTo(2, 1);
        const asleep = run(trick(started({ fullness: 3, energy: 0 }), "nap", 0), 50, 10_000, false);
        const awakeShort = run(send(started({ fullness: 3 }), { type: "walk", dir: "up", now: 0 }), 50, 10_000, false);
        expect(asleep.fullness).toBeGreaterThan(awakeShort.fullness);
    });

    test("a hungry goat bleats on its own and says so", () => {
        const s = tick(started({ fullness: 1 }), 50);
        expect(isHungry(s)).toBe(true);
        expect(s.action).toBe("bleat");
        expect(needsOf(s)).toMatch(/hungry/);
    });
});

describe("energy", () => {
    test("a tired goat yawns instead of jumping or headbutting", () => {
        const tired = started({ energy: 1 });
        expect(trick(tired, "jump", 0).action).toBe("yawn");
        expect(trick(tired, "headbutt", 0).action).toBe("yawn");
        expect(trick(tired, "cuddle", 0).action).toBe("cuddle");
        expect(needsOf(tired)).toBe("The goat is getting sleepy.");
    });

    test("tricks cost energy", () => {
        const s = trick(started({ energy: 4 }), "headbutt", 0);
        expect(s.energy).toBeLessThan(4);
    });

    test("out of energy, it naps on the spot until rested", () => {
        let s = run(started({ energy: 0.001 }), 50, 200, false);
        expect(s.action).toBe("nap");
        s = run(s, 250, 15_000, false);
        expect(s.action).toBe("nap");
        s = run(s, 15_050, 25_000, false);
        expect(s.action).toBe("idle");
        expect(s.energy).toBeCloseTo(MAX, 1);
    });
});

describe("time away", () => {
    const load = (e: GoatEvent) => send(started(), e);

    test("needs drop while the page is closed, but not below the floor", () => {
        const day = 24 * 60 * 60 * 1000;
        const s = load({ type: "load", saved: { cuddles: 7, happiness: 5, fullness: 5, energy: 5 }, elapsedMs: day });
        expect(s.cuddles).toBe(7);
        expect(s.happiness).toBe(OFFLINE_FLOOR);
        expect(s.fullness).toBe(OFFLINE_FLOOR);
        expect(s.energy).toBe(OFFLINE_FLOOR);
    });

    test("a short absence only costs a little", () => {
        const s = load({ type: "load", saved: { cuddles: 0, happiness: 4, fullness: 4, energy: 4 }, elapsedMs: 60_000 });
        expect(s.happiness).toBe(4);
        expect(s.fullness).toBeCloseTo(3.5, 5);
    });

    test("time away never lifts a meter that was already low", () => {
        const s = load({ type: "load", saved: { cuddles: 0, happiness: 1, fullness: 0.5, energy: 1 }, elapsedMs: 60_000_000 });
        expect(s.happiness).toBe(1);
        expect(s.fullness).toBe(0.5);
    });

    test("an old save without needs keeps the defaults", () => {
        const s = load({ type: "load", saved: { cuddles: 3, happiness: 4 }, elapsedMs: 0 });
        expect(s.fullness).toBe(initialGoat().fullness);
        expect(s.energy).toBe(initialGoat().energy);
    });
});

describe("naming", () => {
    test("messages use the goat's name once it has one", () => {
        const unnamed = started({ fullness: 1 });
        expect(needsOf(unnamed)).toBe("The goat's tummy rumbles. It's hungry!");

        const named = send(unnamed, { type: "rename", name: "  Biscuit  " });
        expect(named.name).toBe("Biscuit");
        expect(needsOf(named)).toBe("Biscuit's tummy rumbles. It's hungry!");
        expect(statusOf(trick(named, "cuddle", 0))).toBe("Biscuit enjoys a cuddle!");
    });

    test("names are tidied and capped", () => {
        expect(cleanName("  Sir   Bleats\ta Lot ")).toBe("Sir Bleats a Lot");
        expect(cleanName("x".repeat(50))).toHaveLength(MAX_NAME);
        expect(cleanName("   ")).toBe("");
    });

    test("an empty name goes back to 'The goat'", () => {
        const s = send(send(started(), { type: "rename", name: "Gus" }), { type: "rename", name: " " });
        expect(statusOf(s)).toBe("The goat is facing you.");
    });

    test("the name is restored from a save", () => {
        const s = send(started(), { type: "load", saved: { cuddles: 0, happiness: 3, name: "Gus" }, elapsedMs: 0 });
        expect(s.name).toBe("Gus");
    });
});
