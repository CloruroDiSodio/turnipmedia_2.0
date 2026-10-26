# turnipmedia_2.0

Personal website of Denise Moscon, migrated from Create React App to **Next.js 16 (App Router) + TypeScript** and deployed on [Netlify](https://www.netlify.com/).

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode with Turbopack.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm test`

Runs the Jest test suite (configured through `next/jest`, jsdom environment + React Testing Library).\
See `jest.config.js` and `jest.setup.ts`. `src/__tests__/a11y.test.tsx` runs [axe](https://github.com/dequelabs/axe-core) (via `jest-axe`) against every page, so accessibility regressions fail the build like any other test.

### `npm run build`

Type-checks the project and exports every route as static HTML to `out/`. npm then runs the `postbuild` script (`scripts/csp-headers.mjs`), which writes `out/_headers` with the Content-Security-Policy (see [Security](#security)).

### `npm start`

Serves the production build locally on [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app` — Next.js App Router: root `layout.tsx` (site-wide metadata, self-hosted font, global styles) and routes.
  - `(main)/` — route group for `/`, `/resume`, `/showcase` and `/contacts`; its `layout.tsx` renders the skip link, particles background, header menu and the `<main>` landmark (replacing the old `App.js` pathname check).
  - `goat/` — a bare route with no header/particles; its page component renders its own `<main>`.
  - `not-found.tsx` — the 404 page, exported as `out/404.html`, which Netlify serves for any missing URL. It renders inside the `(main)` layout; the turnip-pulling game lives in `src/components/pages/NotFound/`.
  - `seo.ts` — site URL/name and the `pageMetadata()` helper every route uses for its metadata.
  - `sitemap.ts`, `robots.ts` — generate `sitemap.xml` and `robots.txt` at build time.
- `src/components/{atoms,molecules,pages}` — atomic-design components; route `page.tsx` files are thin wrappers around them that also export the route's `metadata`.
- `src/components/pages/Showcase/projects.ts` — the projects shown as cards on `/showcase`. To add one, append an entry and put its preview image or GIF in `public/showcase/` (the CSP only allows same-origin images). For an animated preview, also add a still frame as `previewStill`: it is shown instead when the visitor prefers reduced motion.
- `src/components/pages/Goat/` — the Goat Companion game; its [README](src/components/pages/Goat/README.md) explains how the goat behaves, saves, and stays accessible.
- `src/__tests__/` — cross-page tests (accessibility).
- `src/index.scss` — global styles (imported by the root layout), including the skip link and the reduced-motion rules.
- `scripts/csp-headers.mjs` — postbuild step that generates the CSP.
- `scripts/goat-sprites.py` — builds the goat's sprite sheets (`public/goat-v2.png` and `public/goat-props.png`) from the original `public/goat.png`, which it leaves untouched. Not part of the build: run it by hand after changing the poses, with Pillow in a local venv (`.venv/` is git-ignored):

  ```sh
  python3 -m venv .venv && .venv/bin/pip install pillow
  .venv/bin/python scripts/goat-sprites.py .
  ```

  If you add or reorder sprite rows, update `POSE_ROWS` in `GoatAnimal.tsx` to match.

## Accessibility

Target: WCAG 2.2 AA. What is in place, and what to keep doing when changing pages:

- **Landmarks and headings** — every page has one `<main>` and exactly one `<h1>`, and heading levels are not skipped. When a heading needs to look smaller or bigger, keep the right level and use Bootstrap's `.h1`–`.h6` classes. The header menu is a `<nav aria-label="Main">`, preceded by a "Skip to main content" link.
- **Names for controls** — icon-only links and buttons need an `aria-label` (see `Contacts.tsx` and the goat controls), and decorative icons get `aria-hidden="true"`. Links that open a new tab say so in their label and use `rel="noopener noreferrer"`.
- **Keyboard** — anything clickable is a `<button>` or `<a>`, never a `<div>`/`<kbd>` with `onClick`. The resume's scrollable box is focusable so it can be scrolled with the keyboard. Menu links show a focus ring and set `aria-current="page"` when active.
- **Color contrast** — text needs at least 4.5:1 and icons/UI parts 3:1. `--light-purple` fails on white, so do not use it for text or icons.
- **Motion** — under `prefers-reduced-motion: reduce` the particles stop (`motion.disable` in `Particles.tsx`) and CSS transitions and animations are cut short (`index.scss`).
- **Language** — the document is `lang="en"`. Italian content (sound titles) is marked `lang="it"`.

`npm test` checks each page with axe and asserts the landmark and h1 rules. Axe catches roughly a third of WCAG issues, so also try keyboard-only navigation and a screen reader on any new interactive feature.

## SEO

- **Metadata** — the root layout sets the defaults: `metadataBase`, a `%s | Denise Moscon` title template, Open Graph and Twitter card, icons and manifest. Each route exports `metadata` built with `pageMetadata({ title, description, path })` from `src/app/seo.ts`, which sets its title, description, canonical URL and social cards. Next.js merges metadata shallowly, so a page's `openGraph` replaces the root one; that is why the helper re-applies `baseOpenGraph`.
- **Canonical URLs** use a trailing slash (`/resume/`) because `trailingSlash: true` makes the export serve each page at that path.
- **Sitemap and robots** — `sitemap.xml` and `robots.txt` are generated from `src/app/sitemap.ts` and `src/app/robots.ts`. **When adding a route, add it to `sitemap.ts`.**
- **Structured data** — the home page embeds schema.org `Person` JSON-LD linking the GitHub, LinkedIn, CodePen and Ko-fi profiles.

## Security

The site is a static export with no server code, forms, auth or user input, so most of the OWASP Top 10 has nothing to apply to. The relevant parts are covered as follows:

- **A05 Security Misconfiguration** — every response gets security headers. The static ones are set in `netlify.toml`: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy`. The **Content-Security-Policy** is generated per build by `scripts/csp-headers.mjs` into `out/_headers`. Next.js puts a few inline scripts in each page whose contents change on every build, so the script finds them, hashes them, and allows exactly those hashes instead of `'unsafe-inline'`. Everything else is `'self'` only, with `object-src 'none'`, `frame-ancestors 'none'` and `form-action 'none'`. Deploy previews and branch deploys also get `frame-src https://app.netlify.com` so the Netlify Drawer can load; production builds (`CONTEXT=production`) leave it out.
  - **Adding an external resource** (a script, image, font, iframe or analytics) will be blocked until its origin is added to the matching directive in `scripts/csp-headers.mjs`.
  - Styles allow `'unsafe-inline'` because React renders `style=""` attributes into the static HTML.
  - HSTS leaves out `includeSubDomains`/`preload` because it does not know whether every subdomain of `turnipmedia.net` serves HTTPS. Add them once that is confirmed.
- **A03 Injection / XSS** — there is no user input. The only `dangerouslySetInnerHTML` is the static JSON-LD on the home page, escaped so it cannot close its `<script>` tag. Keep it that way: never put unescaped dynamic data into it.
- **A06 Vulnerable Components** — `npm audit --omit=dev` reports no vulnerabilities. `npm audit` flags a moderate DoS advisory in `sprintf-js`, which only reaches the project through Jest's coverage tooling (`babel-plugin-istanbul` → `js-yaml@3` → `argparse@1`). No patched version exists, it never ships to the site, and it only runs on our own test files, so it is an accepted risk. The vendored `src/vendor/bootstrap-4.3.1.min.css` is CSS only; the Bootstrap 4 CVEs affect its JavaScript, which is not used.
- **Privacy / third parties** — the VT323 font is self-hosted through `next/font` (downloaded at build time), so visitors make no requests to Google or any other third party.

## Deployment

The site is a fully static export (`output: "export"` in `next.config.ts`) — `next build` emits plain HTML/CSS/JS to `out/`, which Netlify serves from its CDN. No serverless functions or Next.js adapter are involved, matching the deploy model of the original CRA site. `netlify.toml` pins the build (command `npm run build`, publish directory `out`, Node 20) and declares the security headers — the Node pin is required because the Netlify site was originally set up during the CRA era with Node 16, which Next.js 16 no longer supports (it requires Node `>=20.9`).

The build must run through `npm run build` (not `next build` directly), otherwise the `postbuild` CSP step is skipped and the site deploys without a Content-Security-Policy. After a deploy, `curl -sI https://turnipmedia.net/ | grep -i content-security-policy` confirms the policy is being served.

## Learn More

To learn Next.js, check out the [Next.js documentation](https://nextjs.org/docs). To learn React, check out the [React documentation](https://react.dev/).
