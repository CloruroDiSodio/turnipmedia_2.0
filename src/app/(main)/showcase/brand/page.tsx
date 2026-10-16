import Brand from "../../../../components/pages/Brand/Brand";
import { pageMetadata } from "../../../seo";

export const metadata = pageMetadata({
  title: "Brand identity",
  description:
    "The brand identity of Denise Moscon's site: the pixel turnip mascot, the colour palette, the VT323 typeface, the components, motion and voice.",
  path: "/showcase/brand/",
});

export default function BrandPage() {
  return <Brand />;
}
