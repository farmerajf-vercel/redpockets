"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./BalloonAnimation.module.css";


interface Balloon {
  id: number;
  left: number; // percent
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
}

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const createBalloon = (id: number): Balloon => ({
  id,
  left: getRandom(0, 90),
  size: getRandom(60, 200),
  duration: getRandom(4, 8),
  delay: getRandom(0, 2)
});

const BalloonAnimation: React.FC = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const balloonId = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) => [
        ...prev,
        createBalloon(balloonId.current++)
      ]);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  // Clean up balloons that have floated out
  const handleAnimationEnd = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className={styles.container}>
      {balloons.map((balloon) => (
        <img
          key={balloon.id}
          src="/balloon.gif"
          alt="Balloon"
          className={styles.balloon}
          style={{
            left: `${balloon.left}%`,
            width: balloon.size,
            height: balloon.size * 1.1,
            position: 'absolute',
            animationDuration: `${balloon.duration}s`,
            animationDelay: `${balloon.delay}s`,
            zIndex: 101,
            transform: 'translateX(-100%)'
          }}
          onAnimationEnd={() => handleAnimationEnd(balloon.id)}
          onClick={() => handleAnimationEnd(balloon.id)}
        />
      ))}
    </div>
  );
};

export default BalloonAnimation;
