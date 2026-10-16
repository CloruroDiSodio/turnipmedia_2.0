# Goat Companion

The `/goat` page: a pixel-art goat that lives in a pen. Visitors walk it around, cuddle it, feed it turnips and put it to bed. Left alone, it wanders, gets hungry, sleepy and lonely, and dozes off. Visitors can also give it a name.

## Files

| File | What it does |
| --- | --- |
| `goatState.ts` | All of the goat's behaviour, as a pure reducer (`goatReducer`), plus helpers for the pose, the screen-reader text and the needs. |
| `GoatPage.tsx` | The page: runs the clock, handles keyboard and pointer input, saves and loads the goat, and renders the pen, meters, controls and name form. |
| `GoatAnimal.tsx` | Draws one sprite from the sheet and steps through its frames. |
| `bleat.ts` | Synthesises the "meeeh" with the Web Audio API. |
| `usePrefersReducedMotion.ts` | Tracks the visitor's reduced-motion setting, for motion driven by JavaScript. |
| `GoatPage.scss` | Layout, the pen, props (turnip, Zs, heart, "!"), speech bubbles and key caps. |
| `/scripts/goat-sprites.py` | Builds the sprite sheets in `public/` (see [Sprites](#sprites)). |

Tests live in `src/__tests__/goat.test.ts` (the reducer) and `src/__tests__/a11y.test.tsx` (the rendered page).

## How it works

Everything the goat does happens in `goatReducer`. Every event carries the current time, and any randomness it needs, so the reducer never reads a clock or calls `Math.random()`. That keeps it pure, so the tests can step through minutes of goat life without real timers.

`GoatPage` sends these events:

- **`tick`** every 50 ms. A single clock drives walking, wandering, the meters and the end of every timed action. `dt` is capped at 0.1 s, so the goat doesn't teleport when a background tab resumes.
- **`walk` / `stopWalk` / `step`** from the arrow keys and walk buttons.
- **`trick`** (cuddle, nap, jump, headbutt, bleat) and **`feed`**.
- **`start`**, **`resize`** (the pen's size, via `ResizeObserver`), **`load`** and **`rename`**.

### What the goat does

`GoatState.action` holds the goat's current action:

| Action | Starts when | Ends when |
| --- | --- | --- |
| `idle` | Any other action ends | Something below starts |
| `walk` | An arrow key or walk button is pressed | It's released (but always after at least 300 ms), or after 400 ms for a keyboard press on a button |
| `wander` | It has been idle for 8 s, then every 4–8 s, if wandering is on | It reaches a random spot |
| `seek` | There's a turnip, 1 s after the last input | It reaches the turnip |
| `eat` / `sniff` | It reaches the turnip: it eats if it isn't full; if it is full, it sniffs and leaves the turnip until it's no longer full | 2 s / 1.2 s |
| `cuddle`, `jump`, `headbutt`, `bleat` | A trick | 1.5 s, 0.6 s, 0.6 s, 0.9 s |
| `yawn` | A jump or headbutt is asked for while it's tired | 1.2 s |
| `bleat` (by itself) | It's hungry and idle, every 15–25 s | 0.9 s |
| `nap` | The nap trick, or its energy hits 0 (unless it's eating) | After at least 5 s, once its energy is full |
| `sleep` | It has been idle for 30 s (10 s if tired) | It's woken up |
| `startled` | Any input while it's asleep | 0.6 s |

`onItsOwn` is true while an action started by itself (a wander or a hungry bleat). It decides what screen readers hear (see [Accessibility](#accessibility)).

### Needs

Happiness, fullness and energy go from 0 to 5 (`MAX`). They are stored as fractions so they drain smoothly, but they are shown and compared as whole icons (`level()`). A new goat starts at 3, 4 and 4.

| Need | Goes down | Goes up |
| --- | --- | --- |
| Fullness | 1 icon every 120 s awake, every 240 s asleep; a jump costs 0.1, a headbutt 0.15 | +2 per turnip |
| Energy | 1 icon every 180 s awake; a jump costs 0.25, a headbutt 0.35 | +1 icon every 4 s asleep |
| Happiness | 1 icon every 90 s, once 90 s have passed without a cuddle or play | +1 per cuddle; +0.5 per jump, at most once every 3 s so mashing Space doesn't pay |

At 1 icon or less, the goat is **hungry** or **tired**. Hungry or tired, it gains only half the happiness. Tired, it walks at half speed (35 px/s instead of 70), yawns instead of jumping or headbutting, and dozes off sooner.

## Saving

The cuddle count, the three needs and the name are saved in `localStorage` under `goat-companion`. Saves happen every 5 s, when the page is hidden or closed, and when the page unmounts. Nothing leaves the browser.

On load, the time away counts too: the needs drop as if the page had stayed open (`afterAbsence`), but never below 2 (`OFFLINE_FLOOR`). Visitors come back to a peckish goat, not a sad one. Each saved value is checked: anything that isn't a finite number falls back to the default, so damaged storage can't break the meters. The name goes through `cleanName()`, the same tidying the name form uses (single spaces, at most 20 characters).

## Controls and keyboard

| Key | Does |
| --- | --- |
| Arrow keys | Walk (hold) |
| C | Cuddle (clicking the goat does too) |
| F | Feed a turnip (one at a time) |
| Space | Jump |
| H | Headbutt |
| B | Bleat |
| S | Take a nap |

- The shortcuts only work while focus is inside the page's `<main>` (WCAG 2.1.4). `<main>` has `tabIndex={-1}`, so clicking anywhere on the page, or tabbing to any of its controls, turns them on. Elsewhere, keys keep their usual job, and the arrows scroll.
- They're also ignored while typing in the name field, and Space on a focused button presses that button.
- The walk buttons walk for as long as they're held (pointer capture, with no long-press menu). Pressed from the keyboard, they have no pointer events, so each press takes one step instead.
- A key released while the window is in the background never fires `keyup`, so the window's `blur` event stops the walk.

## Accessibility

- **Names.** The goat is a `<button>` named "Cuddle *name*" (plus "(asleep)" while it sleeps). Every icon-only control has an `aria-label` and an `aria-keyshortcuts`. The sprites and props are `aria-hidden`. Each meter is a `role="img"` with a label like "Happiness: 3 of 5 hearts".
- **Live regions.** There are two polite live regions. The first one reads `announcementOf()`: only what the visitor caused (a trick, a walk, feeding, waking it). It stays empty while the goat stands still or acts on its own, so an open tab doesn't keep talking, and a second cuddle is announced afresh. The second one reads `needsOf()`, which speaks only when the goat becomes hungry or sleepy. `statusOf()` describes any action; it's what `announcementOf()` filters.
- **Motion.** Under `prefers-reduced-motion`, the goat doesn't wander, sprites hold one telling frame (`STILL_FRAME`) instead of animating, and the Zs stand still. The "Wandering" toggle lets any visitor switch wandering off, or back on, and switching it off stops a stroll already under way (WCAG 2.2.2).
- **Focus.** The goat, the key buttons and Save show a 2 px `#2c3e50` outline on `:focus-visible`.
- **Sound** is off until the visitor turns it on with the toggle (`aria-pressed`).

## Sprites

- `public/goat.png` is the original sheet and is never edited.
- `public/goat-v2.png` has 12 rows of 4 frames, each 32×32: down, right, up, cuddle, sleep, left, jump, headbutt right, headbutt left, eat right, eat left, bleat.
- `public/goat-props.png` has four 16×16 tiles: turnip, Z, heart and "!".

Both are generated by `scripts/goat-sprites.py`; see the project README for how to run it. In `GoatAnimal.tsx`, `POSE_ROWS` maps each pose to its row and `TOTAL_ROWS` must match the sheet. Poses in `PLAY_ONCE` stop on their last frame; the rest loop.

Sprites are drawn at 3× (`SCALE`) with `image-rendering: pixelated`. Positions are rounded to whole pixels, and hover uses a glow rather than a scale, because a fractional offset or a scale blurs the pixel art. The goat's feet position is its `z-index`, so whichever of the goat and the turnip is lower in the pen is drawn in front.

## Sound

`playBleat()` builds the bleat from oscillators: a sawtooth sliding from 560 to 430 Hz, a 26 Hz warble on its pitch, and a low-pass filter. There is no audio file, so there's nothing to load and nothing to add to the Content-Security-Policy. A single `AudioContext` is created on the first bleat. That can only happen after the visitor has clicked the sound toggle, so browsers let it play.

## Adding a trick

1. In `goatState.ts`, add it to `Trick` (and to `GoatAction` if it's new), give it a `DURATION`, and an `EFFORT` if it should tire the goat. Handle anything special in `trick()`, then add it to `poseOf()` and `statusOf()`.
2. If it needs a new pose, draw the row in `scripts/goat-sprites.py`, run the script, then update `GoatPose`, `POSE_ROWS`, `TOTAL_ROWS` and, if needed, `PLAY_ONCE` and `STILL_FRAME` in `GoatAnimal.tsx`.
3. In `GoatPage.tsx`, add its key to `TRICK_KEYS` and a control with the `key()` helper, passing the label and shortcut.
4. Add tests to `goat.test.ts`, and check the page with a keyboard and a screen reader.
