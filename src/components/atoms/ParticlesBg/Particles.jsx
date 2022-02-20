import React from "react";
import Particles from "react-tsparticles";

const ParticlesBg = () => {
    return (
        <Particles
            id="tsparticles"
            options={{
                particles: {
                    number: {
                        number: {
                            value: 50
                        },
                        size: {
                            value: 3
                        }
                    },
                    color: {
                        value: ["#764B92", "#f8c210", "#004E4D", "#018C99"]
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
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false,
                            speed: 1.5,
                            opacity_min: 0.15,
                            sync: false
                        }
                    },
                    size: {
                        // value: 2.5,
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
                        distance: 110,
                        color: "#33b1f8",
                        opacity: 0.25,
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
    )
};

export default ParticlesBg;
