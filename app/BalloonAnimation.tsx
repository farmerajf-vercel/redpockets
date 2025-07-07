"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./BalloonAnimation.module.css";
import Confetti, { ConfettiBurst } from "./Confetti";


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
  const [confettiBursts, setConfettiBursts] = useState<ConfettiBurst[]>([]);
  const balloonId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleBalloonPop = (id: number, e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    // Remove the balloon
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    // Get the position of the click relative to the viewport
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    setConfettiBursts([
      {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        key: Date.now() + Math.random()
      }
    ]);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <Confetti bursts={confettiBursts} />
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
          onClick={(e) => handleBalloonPop(balloon.id, e)}
        />
      ))}
    </div>
  );
};

export default BalloonAnimation;
