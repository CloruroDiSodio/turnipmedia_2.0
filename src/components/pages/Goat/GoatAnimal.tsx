"use client";

import React, {useState, useEffect} from 'react';
import type {CSSProperties} from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type GoatPose =
  | 'down' | 'right' | 'up' | 'left'
  | 'cuddle' | 'sleep' | 'jump' | 'bleat'
  | 'headbutt-right' | 'headbutt-left'
  | 'eat-right' | 'eat-left';

// Rows of /goat-v2.png (built by scripts/goat-sprites.py).
const POSE_ROWS: Record<GoatPose, number> = {
  down: 0,
  right: 1,
  up: 2,
  cuddle: 3,
  sleep: 4,
  left: 5,
  jump: 6,
  'headbutt-right': 7,
  'headbutt-left': 8,
  'eat-right': 9,
  'eat-left': 10,
  bleat: 11,
};

// These play once and hold their last frame; the rest loop.
const PLAY_ONCE: GoatPose[] = ['sleep', 'jump', 'headbutt-right', 'headbutt-left'];

// The frame shown when motion is reduced: the one that best tells the pose.
const STILL_FRAME: Partial<Record<GoatPose, number>> = {
  sleep: 3,
  jump: 2,
  'headbutt-right': 2,
  'headbutt-left': 2,
  'eat-right': 1,
  'eat-left': 1,
  bleat: 2,
};

const TOTAL_COLS = 4;
const TOTAL_ROWS = 12;

interface GoatAnimalProps {
  pose?: GoatPose;
  // False shows the pose's first frame, e.g. when standing still.
  moving?: boolean;
  speed?: number;
  size?: number;
}

export const GoatAnimal = ({ pose = 'down', moving = true, speed = 150, size = 64 }: GoatAnimalProps) => {
  const [frame, setFrame] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const animate = moving && !reducedMotion;

  useEffect(() => {
    setFrame(0);
    if (!animate) return;

    const once = PLAY_ONCE.includes(pose);
    const interval = setInterval(() => {
      setFrame((f) => {
        if (once && f === TOTAL_COLS - 1) {
          clearInterval(interval);
          return f;
        }
        return (f + 1) % TOTAL_COLS;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [pose, speed, animate]);

  const shown = animate ? frame : moving ? STILL_FRAME[pose] ?? 0 : 0;
  const posX = (shown / (TOTAL_COLS - 1)) * 100;
  const posY = (POSE_ROWS[pose] / (TOTAL_ROWS - 1)) * 100;

  const style: CSSProperties = {
    display: 'block',
    width: `${size}px`,
    aspectRatio: '1 / 1',
    backgroundImage: `url('/goat-v2.png')`,
    backgroundSize: `${TOTAL_COLS * 100}% ${TOTAL_ROWS * 100}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    imageRendering: 'pixelated',
    backgroundRepeat: 'no-repeat',
  };

  // Purely visual sprite: the surrounding button carries the accessible name.
  return <span style={style} aria-hidden="true" />;
};
