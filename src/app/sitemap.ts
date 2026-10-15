import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";

// Required for `output: "export"`: emit sitemap.xml at build time.
export const dynamic = "force-static";

// /appetta is intentionally left out: it is marked noindex.
const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/resume/", priority: 0.8 },
  { path: "/contacts/", priority: 0.6 },
  { path: "/goat/", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority,
  }));
}
