import Library from "../../components/pages/Library/Library";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata({
  title: "My Library",
  description: "The books on Denise Moscon's shelves, and which ones she has read.",
  path: "/library/",
});

export default function LibraryPage() {
  return <Library />;
}
