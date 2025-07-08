import React, { useEffect, useRef, useState } from "react";
import styles from "./RedPocketRain.module.css";

const DURATION = 3500;
const INTERVAL = 350; // ms between new pockets

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

interface Pocket {
  key: number;
  left: number;
  duration: number;
  size: number;
}

const RedPocketRain: React.FC = () => {
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const pocketId = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const left = getRandom(0, 98);
      const duration = getRandom(DURATION * 0.7, DURATION * 1.3);
      const size = getRandom(40, 70);
      setPockets((prev) => [
        ...prev,
        {
          key: pocketId.current++,
          left,
          duration,
          size,
        },
      ]);
    }, INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Remove pockets after animation
  const handleAnimationEnd = (key: number) => {
    setPockets((prev) => prev.filter((p) => p.key !== key));
  };

  return (
    <div className={styles.rainContainer} ref={containerRef}>
      {pockets.map((pocket) => (
        <img
          key={pocket.key}
          src="/redpocket.png"
          alt="Red Pocket"
          className={styles.pocket}
          style={{
            left: `${pocket.left}%`,
            animationDuration: `${pocket.duration}ms`,
            width: `${pocket.size}px`,
            height: `${pocket.size * 1.2}px`,
          }}
          onAnimationEnd={() => handleAnimationEnd(pocket.key)}
        />
      ))}
    </div>
  );
};

export default RedPocketRain;
