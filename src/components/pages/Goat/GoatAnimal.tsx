"use client";

import React, {useState, useEffect} from 'react';
import type {CSSProperties} from 'react';

export type GoatDirection = 'down' | 'right' | 'up' | 'cuddle' | 'sleep';

interface GoatAnimalProps {
  direction?: GoatDirection;
  speed?: number;
}

export const GoatAnimal = ({ direction = 'down', speed = 150 }: GoatAnimalProps) => {
  const [frame, setFrame] = useState(0);

  const rowMap: Record<GoatDirection, number> = {
    down: 0,   
    right: 1,  
    up: 2,     
    cuddle: 3, 
    sleep: 4
  };

  const totalCols = 4;
  const totalRows = 5;

  useEffect(() => {
    // Reset frame to 0 whenever the direction changes
    setFrame(0);

    const interval = setInterval(() => {
      setFrame((f) => {
        // NEW LOGIC: If sleeping and reached the last frame (3), stop moving
        if (direction === 'sleep' && f === totalCols - 1) {
          clearInterval(interval);
          return f;
        }
        return (f + 1) % totalCols;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [direction, speed]); // Added direction to dependencies

  const posX = (frame / (totalCols - 1)) * 100;
  const posY = (rowMap[direction] / (totalRows - 1)) * 100;

  const style: CSSProperties = {
    display: 'block',
    width: '64px',
    aspectRatio: '1 / 1',
    backgroundImage: `url('/goat.png')`,
    backgroundSize: '400% 500%',
    backgroundPosition: `${posX}% ${posY}%`,
    imageRendering: 'pixelated',
    backgroundRepeat: 'no-repeat',
  };

  // Purely visual sprite: the surrounding button carries the accessible name.
  return <span style={style} aria-hidden="true" />;
};