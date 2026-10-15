import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site (all routes prerender, no server features): emit a plain
  // static export to out/ instead of requiring the Next.js runtime/adapter on
  // the host. This matches the deploy model of the original CRA site on Netlify.
  output: "export",
  // Emit route/index.html instead of flat route.html so static hosts serve
  // each route deterministically (no .html content-negotiation needed).
  trailingSlash: true,
  // Scope Turbopack to this repository (otherwise it walks up and picks up
  // stray lockfiles in parent directories, e.g. ~/package-lock.json).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
