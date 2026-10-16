import Link from "next/link";
import type { ComponentProps } from "react";
import "./TextLink.scss";

// A link inside page content, styled to look clickable at rest. The header
// nav uses MenuLink instead.
const TextLink = ({ className, ...props }: ComponentProps<typeof Link>) => (
    <Link className={className ? `text-link ${className}` : "text-link"} {...props} />
);

export default TextLink;
