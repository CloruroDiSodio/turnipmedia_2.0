"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import './HeaderMenu.scss';
import MenuLink from "../../atoms/MenuLink/MenuLink";
import BackgroundToggle from "../../atoms/BackgroundToggle/BackgroundToggle";

const LINKS = [
    { link: "/", label: "Me" },
    { link: "/resume", label: "What have I done with my life" },
    { link: "/showcase", label: "Things I made" },
    { link: "/contacts", label: "Where to find me (if you must!)" },
];

// Scrolls smaller than this are ignored, so a shaky trackpad doesn't make the
// header flicker in and out.
const SCROLL_THRESHOLD = 8;

// Desktop: links in a row. Below the lg breakpoint the links collapse behind a
// "Menu" disclosure button (the list visibility is driven by CSS + isOpen).
const HeaderMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const listId = useId();
    const headerRef = useRef<HTMLElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close after navigating, so the new page is not covered by the menu.
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // The header sticks to the top: it slides away while scrolling down and
    // comes back as soon as the visitor scrolls up.
    useEffect(() => {
        let lastY = window.scrollY;
        let frame = 0;
        const update = () => {
            frame = 0;
            const y = window.scrollY;
            setIsScrolled(y > 0);
            if (Math.abs(y - lastY) < SCROLL_THRESHOLD) return;
            const height = headerRef.current?.offsetHeight ?? 0;
            setIsHidden(y > lastY && y > height);
            lastY = y;
        };
        const onScroll = () => {
            frame ||= window.requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.cancelAnimationFrame(frame);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        };
        const onPointerDown = (event: PointerEvent) => {
            if (!headerRef.current?.contains(event.target as Node)) setIsOpen(false);
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("pointerdown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [isOpen]);

    return (
        <header
            ref={headerRef}
            className={[
                "header-menu",
                // An open menu stays put; keyboard focus inside also keeps it
                // on screen (see :focus-within in the styles).
                isHidden && !isOpen ? "header-menu--hidden" : "",
                isScrolled ? "header-menu--scrolled" : "",
            ].filter(Boolean).join(" ")}
        >
            <BackgroundToggle />
            <nav className="header-menu__nav" aria-label="Main">
                <button
                    ref={buttonRef}
                    type="button"
                    className="header-menu__toggle"
                    aria-expanded={isOpen}
                    aria-controls={listId}
                    onClick={() => setIsOpen((open) => !open)}
                >
                    <span className="header-menu__icon" aria-hidden="true" />
                    Menu
                </button>
                <ul
                    id={listId}
                    className={isOpen ? "header-menu__list header-menu__list--open" : "header-menu__list"}
                >
                    {LINKS.map(({ link, label }) => (
                        <li key={link}>
                            <MenuLink link={link} label={label} />
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}

export default HeaderMenu
