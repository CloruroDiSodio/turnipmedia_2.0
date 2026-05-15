import React, { useState, useEffect, useRef } from "react";
import { IoMdHeart } from "react-icons/io";
import { 
    MdKeyboardArrowUp, 
    MdKeyboardArrowDown, 
    MdKeyboardArrowRight, 
    MdAdsClick
} from "react-icons/md";
import './GoatPage.scss';
import { GoatAnimal } from "./GoatAnimal";

const GoatPage = () => {
    const [dir, setDir] = useState('down');
    const [showHeart, setShowHeart] = useState(false);
    const timerRef = useRef(null);

    const triggerAction = (newDir) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        
        setDir(newDir);
        
        if (newDir === 'cuddle') {
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 800);
        }

        const duration = newDir === 'sleep' ? 5000 : 500;

        timerRef.current = setTimeout(() => {
            setDir('down');
        }, duration);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
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
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className="goatPage">
            <div className="game-layout">
                {/* Goat Display Section */}
                <div className="goat-section">
                    <h3>GOAT COMPANION</h3>
                    <div 
                        className="goat-container"
                        onClick={() => triggerAction('cuddle')} 
                    >
                        {showHeart && (
                            <div className="heart-pop">
                                <IoMdHeart color="#ff4d4d" size={32} />
                            </div>
                        )}
                        <GoatAnimal direction={dir} />
                    </div>
                </div>

                {/* Interactive Controls Card */}
                <div className="instructions-card">
                    <h4>Controls</h4>
                    <ul>
                        <li>
                            <div className="keys">
                                <kbd onClick={() => triggerAction('up')}><MdKeyboardArrowUp /></kbd>
                                <kbd onClick={() => triggerAction('down')}><MdKeyboardArrowDown /></kbd>
                                <kbd onClick={() => triggerAction('right')}><MdKeyboardArrowRight /></kbd>
                            </div>
                            <span>Move around</span>
                        </li>
                        <li>
                            <div className="keys">
                                <kbd onClick={() => triggerAction('cuddle')}>C</kbd> / <kbd onClick={() => triggerAction('cuddle')}><MdAdsClick/></kbd>
                            </div>
                            <span>Cuddle!</span>
                        </li>
                        <li>
                            <div className="keys">
                                <kbd onClick={() => triggerAction('sleep')}>S</kbd>
                            </div>
                            <span>Take a nap</span>
                        </li>
                    </ul>
                    <p className="note">
                        <b>Tap the icons</b> or use your keyboard!<br />
                        Sleep lasts 5s, others reset in 0.5s.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GoatPage;