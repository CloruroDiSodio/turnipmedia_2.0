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

    // react-router v6's NavLink matches the root path exactly ("the root URL
    // path behaves as if `end` were always `true`"), so "Me" is active only
    // on "/", while the other links match their path or a sub-path of it.
    const isActive = link === "/"
        ? pathname === "/"
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