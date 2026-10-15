import Contacts from "../../../components/pages/Contacts/Contacts";
import { pageMetadata } from "../../seo";

export const metadata = pageMetadata({
  title: "Contacts",
  description:
    "Get in touch with Denise Moscon, front-end developer: email, GitHub, LinkedIn and CodePen.",
  path: "/contacts/",
});

export default function ContactsPage() {
  return <Contacts />;
}
