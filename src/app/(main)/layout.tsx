import type { ReactNode } from "react";
import HeaderMenu from "../../components/molecules/HeaderMenu/HeaderMenu";
import ParticlesBg from "../../components/atoms/ParticlesBg/Particles";

// Replaces the pathname check previously living in App.js:
// header + particles are rendered only for "/", "/resume" and "/contacts".
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ParticlesBg />
      <HeaderMenu />
      {children}
    </>
  );
}
