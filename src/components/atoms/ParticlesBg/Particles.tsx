"use client";

import dynamic from "next/dynamic";

// react-tsparticles touches browser APIs (window/canvas), so it is loaded
// lazily and never rendered during server-side rendering.
const Particles = dynamic(() => import("react-tsparticles"), {ssr: false});

const ParticlesBg = () => {
    // Decorative only: hidden from assistive technology.
    return (
        <div aria-hidden="true">
            <Particles
                id="tsparticles"
                options={{
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
                }}
            />
        </div>
    )
};

export default ParticlesBg;