"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import { FiEyeOff, FiPause, FiPlay } from "react-icons/fi";
import {
    PARTICLES_MODES,
    ParticlesMode,
    setParticlesMode,
    useParticlesMode,
} from "../ParticlesBg/particlesMode";
import "./BackgroundToggle.scss";

const OPTIONS: Record<ParticlesMode, { label: string; Icon: IconType }> = {
    moving: { label: "Moving background", Icon: FiPlay },
    still: { label: "Still background", Icon: FiPause },
    off: { label: "Hide background", Icon: FiEyeOff },
};

// Lets visitors pause or hide the animated background (WCAG 2.2.2).
// Icon-only to stay compact: names come from aria-label, and a tooltip shows
// the same text on hover/keyboard focus (aria-hidden, so it isn't read twice).
const BackgroundToggle = () => {
    const mode = useParticlesMode();
    // Escape hides the tooltip until the pointer/focus moves on (WCAG 1.4.13).
    const [tooltipDismissed, setTooltipDismissed] = useState(false);

    return (
        <div
            className={tooltipDismissed ? "background-toggle background-toggle--tooltip-dismissed" : "background-toggle"}
            role="group"
            aria-label="Background"
            onKeyDown={(event) => {
                if (event.key === "Escape") setTooltipDismissed(true);
            }}
            onPointerLeave={() => setTooltipDismissed(false)}
            onFocus={() => setTooltipDismissed(false)}
        >
            {PARTICLES_MODES.map((option) => {
                const { label, Icon } = OPTIONS[option];
                return (
                    <button
                        key={option}
                        type="button"
                        className="background-toggle__option"
                        aria-label={label}
                        aria-pressed={mode === option}
                        onClick={() => setParticlesMode(option)}
                    >
                        <Icon aria-hidden="true" focusable="false" />
                        <span className="background-toggle__tooltip" aria-hidden="true">
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default BackgroundToggle;
