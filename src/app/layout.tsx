import type { Metadata, Viewport } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.scss";

export const metadata: Metadata = {
  // Absolute base used to resolve relative social/OG image URLs
  // (avoids the localhost fallback in the metadataBase warning).
  metadataBase: new URL("https://turnipmedia.it"),
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
    url: "https://turnipmedia.it",
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
    <html lang="en">
      <body>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Arvo:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
        {children}
      </body>
    </html>
  );
}
