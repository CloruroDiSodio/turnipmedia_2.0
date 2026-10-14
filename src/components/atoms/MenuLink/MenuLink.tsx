"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./MenuLink.scss";

interface MenuLinkProps {
    link: string;
    label: string;
}

const MenuLink = ({link, label}: MenuLinkProps) => {
    const pathname = usePathname();

    // Mirrors the previous react-router NavLink default matching (no "end"
    // prop): the root link is active on every path, the others match by prefix.
    const isActive = link === "/"
        ? true
        : pathname === link || pathname.startsWith(`${link}/`);

    return (
        <Link
            className={isActive ? "menu-link menu-link--active" : "menu-link"}
            href={link}
        >
            {label}
        </Link>
    )
}

export default MenuLink