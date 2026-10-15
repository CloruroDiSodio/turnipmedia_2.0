import Resume from "../../../components/pages/Resume/Resume";
import { pageMetadata } from "../../seo";

export const metadata = pageMetadata({
  title: "Resume",
  description:
    "Career, studies and skills of Denise Moscon, front-end developer working with React, React Native, Next.js and Gatsby.",
  path: "/resume/",
});

export default function ResumePage() {
  return <Resume />;
}
