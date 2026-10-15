import Appetta from "../../components/pages/Appetta/Appetta";
import type { Metadata } from "next";
import { pageMetadata } from "../seo";

// A private soundboard gift: shareable by link, but kept out of search
// results (and out of the sitemap).
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Appetta",
    description: "A Christmas soundboard gift for Sergio.",
    path: "/appetta/",
  }),
  robots: { index: false, follow: false },
};

export default function AppettaPage() {
  return <Appetta />;
}
