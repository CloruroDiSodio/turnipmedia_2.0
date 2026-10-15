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
See `jest.config.js` and `jest.setup.ts`.

### `npm run build`

Builds the app for production to the `.next` folder, type-checks the project and prerenders all routes as static pages.

### `npm start`

Serves the production build locally on [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app` — Next.js App Router: root `layout.tsx` (metadata, fonts, global styles) and routes.
  - `(main)/` — route group for `/`, `/resume` and `/contacts`; its `layout.tsx` renders the particles background and header menu (replacing the old `App.js` pathname check).
  - `appetta/`, `library/`, `goat/` — bare routes with no header/particles.
- `src/components/{atoms,molecules,pages}` — existing atomic-design components, now TypeScript; route `page.tsx` files are thin wrappers around them.
- `src/index.scss` — global styles (imported by the root layout).

## Deployment

The site is a fully static export (`output: "export"` in `next.config.ts`) — `next build` emits plain HTML/CSS/JS to `out/`, which Netlify serves from its CDN. No serverless functions or Next.js adapter are involved, matching the deploy model of the original CRA site. `netlify.toml` pins the build (command `npm run build`, publish directory `out`, Node 20) — the Node pin is required because the Netlify site was originally set up during the CRA era with Node 16, which Next.js 16 no longer supports (it requires Node `>=20.9`).

## Learn More

To learn Next.js, check out the [Next.js documentation](https://nextjs.org/docs). To learn React, check out the [React documentation](https://reactjs.org/).
