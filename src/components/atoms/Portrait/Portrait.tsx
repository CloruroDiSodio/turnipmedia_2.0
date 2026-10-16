"use client";

import { useState } from "react";
import "./Portrait.scss";

// Self-portrait card: the button swaps the standing pose for the tea-break
// one. Both images are always rendered (stacked, cross-faded) so the swap
// never waits on a download.
const Portrait = () => {
    const [teaBreak, setTeaBreak] = useState(false);

    return (
        <figure className={teaBreak ? "portrait portrait--tea" : "portrait"}>
            <div className="portrait__frame">
                {/* Static export: next/image optimisation is not available. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="portrait__img portrait__img--hi"
                    src="/home/portrait.jpg"
                    alt={teaBreak ? "" : "Illustrated self-portrait of Denise: round glasses, blue-tipped hair, green sweater, smiling"}
                    width={601}
                    height={760}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="portrait__img portrait__img--tea"
                    src="/home/portrait-tea.jpg"
                    alt={teaBreak ? "Illustrated self-portrait of Denise sitting cross-legged, sipping a steaming cup of tea" : ""}
                    width={601}
                    height={760}
                />
            </div>
            <figcaption className="portrait__caption">
                <span aria-live="polite">{teaBreak ? "A cup of tea." : "That's me!"}</span>
                <button
                    type="button"
                    className="portrait__button"
                    aria-pressed={teaBreak}
                    onClick={() => setTeaBreak(!teaBreak)}
                >
                    Tea break
                </button>
            </figcaption>
        </figure>
    );
};

export default Portrait;
