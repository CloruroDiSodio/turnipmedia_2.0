import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Scope Turbopack to this repository (otherwise it walks up and picks up
  // stray lockfiles in parent directories, e.g. ~/package-lock.json).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
