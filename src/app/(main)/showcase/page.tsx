import Showcase from "../../../components/pages/Showcase/Showcase";
import { pageMetadata } from "../../seo";

export const metadata = pageMetadata({
  title: "Showcase",
  description:
    "Side projects by Denise Moscon, senior frontend engineer: small games, experiments and web apps, plus company websites worked on as part of a team.",
  path: "/showcase/",
});

export default function ShowcasePage() {
  return <Showcase />;
}
