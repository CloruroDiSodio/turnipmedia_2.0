import Home from "../../components/pages/Home/Home";
import type { Metadata } from "next";

// Inherits the default title and social cards from the root layout.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <Home />;
}
