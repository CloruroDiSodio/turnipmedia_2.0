import React, {useState, useEffect} from 'react';

export const GoatAnimal = ({ direction = 'down', speed = 150 }) => {
  const [frame, setFrame] = useState(0);

  const rowMap = {
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

  const style = {
    width: '64px',
    aspectRatio: '1 / 1',
    backgroundImage: `url('/goat.png')`,
    backgroundSize: '400% 500%',
    backgroundPosition: `${posX}% ${posY}%`,
    imageRendering: 'pixelated',
    backgroundRepeat: 'no-repeat',
  };

  return <div style={style} />;
};