"use client";

import { useState, useEffect, useRef } from "react";
import { IoMdHeart } from "react-icons/io";
import { 
    MdKeyboardArrowUp, 
    MdKeyboardArrowDown, 
    MdKeyboardArrowRight, 
    MdAdsClick
} from "react-icons/md";
import './GoatPage.scss';
import { GoatAnimal } from "./GoatAnimal";
import type { GoatDirection } from "./GoatAnimal";

const GOAT_STATUS: Record<GoatDirection, string> = {
    down: "The goat is facing you.",
    right: "The goat walks right.",
    up: "The goat walks up.",
    cuddle: "The goat enjoys a cuddle!",
    sleep: "The goat is taking a nap.",
};

const GoatPage = () => {
    const [dir, setDir] = useState<GoatDirection>('down');
    const [showHeart, setShowHeart] = useState(false);
    const timerRef = useRef<number | null>(null);

    const triggerAction = (newDir: GoatDirection) => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        
        setDir(newDir);
        
        if (newDir === 'cuddle') {
            setShowHeart(true);
            window.setTimeout(() => setShowHeart(false), 800);
        }

        const duration = newDir === 'sleep' ? 5000 : 1500;

        timerRef.current = window.setTimeout(() => {
            setDir('down');
        }, duration);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (e.key === 'ArrowUp') triggerAction('up');
            if (e.key === 'ArrowDown') triggerAction('down');
            if (e.key === 'ArrowRight') triggerAction('right');
            if (key === 's') triggerAction('sleep');
            if (key === 'c') triggerAction('cuddle');
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <main className="goatPage">
            <div className="game-layout">
                {/* Goat Display Section */}
                <div className="goat-section">
                    <h1 className="h3">GOAT COMPANION</h1>
                    <button
                        type="button"
                        className="goat-container"
                        aria-label="Cuddle the goat"
                        onClick={() => triggerAction('cuddle')}
                    >
                        {showHeart && (
                            <span className="heart-pop" aria-hidden="true">
                                <IoMdHeart color="#ff4d4d" size={32} />
                            </span>
                        )}
                        <GoatAnimal direction={dir} />
                    </button>
                    {/* Announces what the goat is doing to screen readers. */}
                    <p className="visually-hidden" aria-live="polite">
                        {GOAT_STATUS[dir]}
                    </p>
                </div>

                {/* Interactive Controls Card */}
                <div className="instructions-card">
                    <h2 className="h4">Controls</h2>
                    <ul>
                        <li>
                            <div className="keys">
                                <button type="button" className="key" aria-label="Move up" onClick={() => triggerAction('up')}><kbd><MdKeyboardArrowUp aria-hidden="true" /></kbd></button>
                                <button type="button" className="key" aria-label="Move down" onClick={() => triggerAction('down')}><kbd><MdKeyboardArrowDown aria-hidden="true" /></kbd></button>
                                <button type="button" className="key" aria-label="Move right" onClick={() => triggerAction('right')}><kbd><MdKeyboardArrowRight aria-hidden="true" /></kbd></button>
                            </div>
                            <span>Move around</span>
                        </li>
                        <li>
                            <div className="keys">
                                <button type="button" className="key" aria-label="Cuddle (C)" onClick={() => triggerAction('cuddle')}><kbd>C</kbd></button> / <button type="button" className="key" aria-label="Cuddle" onClick={() => triggerAction('cuddle')}><kbd><MdAdsClick aria-hidden="true" /></kbd></button>
                            </div>
                            <span>Cuddle</span>
                        </li>
                        <li>
                            <div className="keys">
                                <button type="button" className="key" aria-label="Take a nap (S)" onClick={() => triggerAction('sleep')}><kbd>S</kbd></button>
                            </div>
                            <span>Take a nap</span>
                        </li>
                    </ul>
                    <p className="note">
                        <b>Tap the icons</b> or use your keyboard!<br />
                        Sleep lasts 5s, others reset in 1.5s.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default GoatPage;