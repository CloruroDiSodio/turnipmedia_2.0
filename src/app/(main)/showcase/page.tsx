import Showcase from "../../../components/pages/Showcase/Showcase";
import { pageMetadata } from "../../seo";

export const metadata = pageMetadata({
  title: "Showcase",
  description:
    "Side projects by Denise Moscon, front-end developer: small games, experiments and web apps.",
  path: "/showcase/",
});

export default function ShowcasePage() {
  return <Showcase />;
}
