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
                            value: 100
                        },
                        size: {
                            value: 4
                        }
                    },
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
    )
};

export default ParticlesBg;
