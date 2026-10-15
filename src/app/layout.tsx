import type { Metadata, Viewport } from "next";
import { VT323 } from "next/font/google";
import { SITE_NAME, SITE_URL, baseOpenGraph } from "./seo";
// Global CSS — import order here IS the cascade order, mirroring the original
// CRA page (index.html <head> Bootstrap 4 CDN link first, bundled CSS after):
// 1. vendored Bootstrap 4 (CDN copy), 2. npm Bootstrap 5 (react-bootstrap), 3. site.
// If these ever load out of order, Bootstrap's `:root` variables (--teal/--gray)
// and `body` font-family override the site palette and the VT323 font.
import "../vendor/bootstrap-4.3.1.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.scss";

// Self-hosted at build time by next/font: no request to Google Fonts at
// runtime (no visitor IP sent to a third party, no external origin in the
// CSP). index.scss applies it through the --font-vt323 variable.
const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  // Absolute base used to resolve relative social/OG image URLs
  // (avoids the localhost fallback in the metadataBase warning).
  metadataBase: new URL(SITE_URL),
  // Pages set a short title; the template appends the site name.
  title: {
    default: "Denise Moscon | Front-end Developer",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Front-end developer based in Verona, React Developer, React native developer",
  keywords: [
    "front-end",
    "sviluppo front-end",
    "frontend",
    "front-end developer",
    "front-end development",
    "reactjs",
    "react",
    "react native",
    "sviluppatore front-end verona",
    "verona web developer",
    "web developer",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/logo192.png" },
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    ...baseOpenGraph,
    title: "Denise Moscon | Front-end Developer",
    description: "Front-end Developer based in Verona",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
  other: {
    "msapplication-TileColor": "#018C99",
    "msapplication-TileImage": "/ms-icon-144x144.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Browser extensions (e.g. the one injecting cz-shortcut-listen) add
    // attributes to <html>/<body> before React hydrates, which would
    // otherwise trigger a hydration-mismatch warning. suppressHydrationWarning
    // only skips attribute checks on these two elements — their children are
    // still validated.
    <html lang="en" className={vt323.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
