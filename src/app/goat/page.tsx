import GoatPage from "../../components/pages/Goat/GoatPage";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata({
  title: "Goat Companion",
  description: "A tiny pixel-art goat to walk around, cuddle and put to sleep.",
  path: "/goat/",
});

export default function GoatRoutePage() {
  return <GoatPage />;
}
