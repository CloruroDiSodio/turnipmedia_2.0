"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import type { Container, ISourceOptions } from "tsparticles";
import { useParticlesMode } from "./particlesMode";

// react-tsparticles touches browser APIs (window/canvas), so it is loaded
// lazily and never rendered during server-side rendering.
const Particles = dynamic(() => import("react-tsparticles"), {ssr: false});

// Module-level so the reference never changes: react-tsparticles destroys and
// rebuilds the canvas whenever its props differ.
const options: ISourceOptions = {
        // Stop the animation entirely for users who ask the OS for
        // reduced motion (the default only slows it down).
        motion: {
            disable: true,
        },
        particles: {
            // NOTE: the original config had a malformed nested block
            // (`number: { number: {...}, size: {...} }`) which
            // tsparticles ignores at runtime (its own types reject it):
            // the effective count/size always came from the engine
            // defaults + the top-level `size` below. It is omitted here
            // so the config type-checks without changing behaviour.
            color: {
                value: ["#f8c210", "#004E4D", "#018C99"]
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 15
                }
            },
            opacity: {
                value: 0.6,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.5,
                    opacity_min: 0.15,
                    sync: false
                }
            },
            size: {
                value: 7,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.15,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 90,
                color: "#787878",
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.6,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                }
            }
        },
        retina_detect: true
};

// Stop the loop but render one frame, so "still" shows a frozen background
// instead of an empty canvas.
const freeze = (container: Container) => {
    container.pause();
    container.draw(false);
};

const ParticlesBg = () => {
    const mode = useParticlesMode();
    const container = useRef<Container | null>(null);
    const modeRef = useRef(mode);

    // Stable callback (see `options`); reads the latest mode via the ref.
    const loaded = useCallback(async (loadedContainer: Container) => {
        container.current = loadedContainer;
        // tsparticles resumes on its own (when the canvas scrolls back into
        // view, after a resize-triggered refresh), which would override a
        // visitor's pause. Only let it animate while the mode is "moving";
        // otherwise render a single frame so the canvas never goes blank.
        const play = loadedContainer.play.bind(loadedContainer);
        loadedContainer.play = (force?: boolean) => {
            if (modeRef.current === "moving") play(force);
            else loadedContainer.draw(false);
        };
        if (modeRef.current === "still") freeze(loadedContainer);
    }, []);

    useEffect(() => {
        modeRef.current = mode;
        const current = container.current;
        if (!current) return;
        if (mode === "off") {
            // The canvas unmounts and destroys this container; a new one
            // arrives through `loaded` when the background comes back.
            container.current = null;
        } else if (mode === "still") {
            freeze(current);
        } else {
            current.play();
        }
    }, [mode]);

    if (mode === "off") return null;

    // Decorative only: hidden from assistive technology.
    return (
        <div aria-hidden="true">
            <Particles id="tsparticles" options={options} loaded={loaded} />
        </div>
    )
};

export default ParticlesBg;
