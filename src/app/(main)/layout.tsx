import type { ReactNode } from "react";
import HeaderMenu from "../../components/molecules/HeaderMenu/HeaderMenu";
import ParticlesBg from "../../components/atoms/ParticlesBg/Particles";

// Replaces the pathname check previously living in App.js:
// header + particles are rendered only for "/", "/resume" and "/contacts".
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* First focusable element: lets keyboard users bypass the nav. */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <ParticlesBg />
      <HeaderMenu />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
