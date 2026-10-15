// Postbuild step: writes out/_headers with a Content-Security-Policy that
// allows the static export's inline <script>s by hash instead of
// 'unsafe-inline'.
//
// Next.js inlines a few small bootstrap/RSC-payload scripts into every
// prerendered page, and their contents change on every build, so the hashes
// have to be computed from the build output. Netlify serves out/_headers
// alongside the static headers declared in netlify.toml.
//
// One policy (the union of every page's hashes) covers the whole site:
// Netlify joins duplicate headers from overlapping rules, which for CSP
// would mean enforcing several policies at once.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "out";

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

// Inline scripts the browser executes: no src, and no type other than
// JavaScript (JSON-LD data blocks are never executed, so CSP ignores them).
const SCRIPT_RE = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi;
const EXECUTABLE_TYPE_RE = /\stype=["']?(text\/javascript|module)["']?/i;

const hashes = new Set();
for (const file of htmlFiles(OUT_DIR)) {
  for (const [, attrs = "", body] of readFileSync(file, "utf8").matchAll(SCRIPT_RE)) {
    if (/\ssrc=/i.test(attrs) || !body) continue;
    if (/\stype=/i.test(attrs) && !EXECUTABLE_TYPE_RE.test(attrs)) continue;
    hashes.add(`'sha256-${createHash("sha256").update(body).digest("base64")}'`);
  }
}

const policy = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(" ")}`,
  // React renders style="" attributes (goat sprite, table cursors) into
  // the static HTML, which needs 'unsafe-inline' for styles.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  // Client-side navigation fetches the prerendered RSC payloads.
  "connect-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

writeFileSync(join(OUT_DIR, "_headers"), `/*\n  Content-Security-Policy: ${policy}\n`);
console.log(`Wrote ${OUT_DIR}/_headers (CSP with ${hashes.size} inline script hashes)`);
