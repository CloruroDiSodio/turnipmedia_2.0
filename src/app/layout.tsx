import type { Metadata, Viewport } from "next";
// Global CSS — import order here IS the cascade order, mirroring the original
// CRA page (index.html <head> Bootstrap 4 CDN link first, bundled CSS after):
// 1. vendored Bootstrap 4 (CDN copy), 2. npm Bootstrap 5 (react-bootstrap), 3. site.
// If these ever load out of order, Bootstrap's `:root` variables (--teal/--gray)
// and `body` font-family override the site palette and the VT323 font.
import "../vendor/bootstrap-4.3.1.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.scss";

export const metadata: Metadata = {
  // Absolute base used to resolve relative social/OG image URLs
  // (avoids the localhost fallback in the metadataBase warning).
  metadataBase: new URL("https://turnipmedia.net"),
  title: "Denise Moscon | Front-end Developer",
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
  openGraph: {
    title: "Denise Moscon | Front-end Developer",
    description: "Front-end Developer based in Verona",
    url: "https://turnipmedia.net",
    images: [{ url: "/preview.png" }],
  },
  other: {
    "msapplication-TileColor": "#ffffff",
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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* `precedence` makes React 19 hoist these into <head> (as CRA did
            with its <head> links in public/index.html) instead of leaving
            them at the end of <body>. Fonts only declare @font-face, so their
            position in the cascade is irrelevant — only that they load. */}
        <link
          href="https://fonts.googleapis.com/css?family=Arvo:400,700&display=swap"
          rel="stylesheet"
          precedence="cdn"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
          precedence="cdn"
        />
        {children}
      </body>
    </html>
  );
}
