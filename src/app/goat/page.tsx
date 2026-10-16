import GoatPage from "../../components/pages/Goat/GoatPage";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata({
  title: "Goat Companion",
  description: "A tiny pixel-art goat to walk around its pen, cuddle, feed and put to bed before it gets hungry or sleepy.",
  path: "/goat/",
});

export default function GoatRoutePage() {
  return <GoatPage />;
}
