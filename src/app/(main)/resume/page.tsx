import Resume from "../../../components/pages/Resume/Resume";
import { pageMetadata } from "../../seo";

export const metadata = pageMetadata({
  title: "Resume",
  description:
    "Career, studies and skills of Denise Moscon, senior frontend engineer working with React, Next.js, TypeScript and headless CMSs.",
  path: "/resume/",
});

export default function ResumePage() {
  return <Resume />;
}
