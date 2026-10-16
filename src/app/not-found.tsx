import type { Metadata } from "next";
import MainLayout from "./(main)/layout";
import NotFound from "../components/pages/NotFound/NotFound";

// The static export writes this to out/404.html, which Netlify serves for
// any URL that has no file. It renders inside the (main) layout so visitors
// still get the header menu and the skip link. Next.js adds the noindex
// robots tag to it by itself.
export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. It may be buried in the turnip patch.",
};

export default function NotFoundPage() {
  return (
    <MainLayout>
      <NotFound />
    </MainLayout>
  );
}
