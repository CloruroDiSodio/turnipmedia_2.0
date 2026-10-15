import type { Metadata } from "next";

export const SITE_URL = "https://turnipmedia.net";
export const SITE_NAME = "Denise Moscon";

const OG_IMAGE = {
  url: "/preview.png",
  width: 1515,
  height: 938,
  alt: "Denise Moscon, front-end developer",
};

// Shared Open Graph fields. Next.js merges metadata shallowly, so a page that
// sets `openGraph` replaces the root one entirely: every page spreads these.
export const baseOpenGraph = {
  type: "website",
  siteName: SITE_NAME,
  locale: "en_US",
  images: [OG_IMAGE],
} satisfies Metadata["openGraph"];

interface PageMetadataOptions {
  title: string;
  description: string;
  // Route path with the trailing slash the static export serves it at
  // (next.config.ts sets trailingSlash: true), e.g. "/resume/".
  path: string;
}

// Title, description, canonical URL and social cards for a single route.
export function pageMetadata({ title, description, path }: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
}
