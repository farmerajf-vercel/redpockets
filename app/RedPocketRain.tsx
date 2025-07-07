import React, { useEffect, useRef } from "react";
import styles from "./RedPocketRain.module.css";

const NUM_POCKETS = 30;
const DURATION = 3500;
const DELAY_WINDOW = 7; // seconds, spread rain over 7s

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const RedPocketRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Optionally: could add/remount logic here
  }, []);

  return (
    <div className={styles.rainContainer} ref={containerRef}>
      {Array.from({ length: NUM_POCKETS }).map((_, i) => {
        const left = getRandom(0, 98);
        const delay = getRandom(0, DELAY_WINDOW);
        const duration = getRandom(DURATION * 0.7, DURATION * 1.3);
        const size = getRandom(40, 70);
        return (
          <img
            key={i}
            src="/redpocket.png"
            alt="Red Pocket"
            className={styles.pocket}
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}ms`,
              width: `${size}px`,
              height: `${size * 1.2}px`,
            }}
          />
        );
      })}
    </div>
  );
};

export default RedPocketRain;
