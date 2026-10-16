import Link from "next/link";
import type { ComponentProps } from "react";
import "./TextLink.scss";

type TextLinkProps = ComponentProps<typeof Link> & {
    // "inline" for a link inside a sentence; "action" for a call to action
    // (a chip), usually in a row like "See my work · Say hi".
    variant?: "inline" | "action";
};

// A link inside page content, styled to look clickable at rest. The header
// nav uses MenuLink instead.
const TextLink = ({ variant = "inline", className, ...props }: TextLinkProps) => (
    <Link
        className={["text-link", `text-link--${variant}`, className].filter(Boolean).join(" ")}
        {...props}
    />
);

export default TextLink;
