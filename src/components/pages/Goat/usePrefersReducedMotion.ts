"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// True when the visitor asked for less motion. The CSS rule in index.scss only
// shortens CSS animations, so JS-driven motion has to check this itself.
export const usePrefersReducedMotion = () => {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        if (typeof window.matchMedia !== "function") return;
        const media = window.matchMedia(QUERY);
        setReduced(media.matches);
        const onChange = () => setReduced(media.matches);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    return reduced;
};
