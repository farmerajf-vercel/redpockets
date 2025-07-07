"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./BalloonAnimation.module.css";
import Confetti, { ConfettiBurst } from "./Confetti";
import RedPocketBurst from "./RedPocketBurst";
import Winner from "./Winner";


interface Balloon {
  id: number;
  left: number; // percent
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  color: 'red' | 'green' | 'blue';
}

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const balloonColors = ['red', 'green', 'blue'] as const;
const balloonFilters: Record<'red' | 'green' | 'blue', string> = {
  red: 'none',
  green: 'hue-rotate(90deg) saturate(1.2)',
  blue: 'hue-rotate(200deg) saturate(1.4)'
};

const createBalloon = (id: number): Balloon => ({
  id,
  left: getRandom(0, 90),
  size: getRandom(60, 200),
  duration: getRandom(2, 4),
  delay: getRandom(0, 2),
  color: balloonColors[Math.floor(Math.random() * balloonColors.length)]
});

const BalloonAnimation: React.FC = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [confettiBursts, setConfettiBursts] = useState<ConfettiBurst[]>([]);
  const [redPocketBursts, setRedPocketBursts] = useState<any[]>([]);
  const [winnerTriggered, setWinnerTriggered] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const balloonId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer start
  useEffect(() => {
    if (startTime === null) setStartTime(Date.now());
  }, [startTime]);

  // Balloon generation interval
  useEffect(() => {
    if (winnerTriggered) return; // Stop spawning on win
    const interval = setInterval(() => {
      setBalloons((prev) => [
        ...prev,
        createBalloon(balloonId.current++)
      ]);
    }, 300);
    return () => clearInterval(interval);
  }, [winnerTriggered]);

  // Clean up balloons that have floated out
  const handleAnimationEnd = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  // Winner logic: after 15s, chance increases with time
  function shouldWin(): boolean {
    if (winnerTriggered || !startTime) return false;
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed < 15) return false;
    // Chance increases linearly from 2% at 15s to 80% at 45s
    const chance = Math.min(0.02 + (elapsed - 20) * 0.026, 0.7);
    return Math.random() < chance;
  }

  const handleBalloonPop = (id: number, e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (winnerTriggered) return;
    // Remove the balloon
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    // Get the position of the click relative to the viewport
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const burstX = rect.left + rect.width / 2;
    const burstY = rect.top + rect.height / 2;
    if (shouldWin()) {
      setWinnerTriggered(true);
      setRedPocketBursts([{ x: burstX, y: burstY, key: Date.now() + Math.random() }]);
    } else {
      setConfettiBursts([
        {
          x: burstX,
          y: burstY,
          key: Date.now() + Math.random()
        }
      ]);
    }
  };



  return (
    <div className={styles.container} ref={containerRef}>
      <Winner visible={winnerTriggered} />
      {!winnerTriggered && <Confetti bursts={confettiBursts} />}
      {winnerTriggered && redPocketBursts.map((burst) => (
        <RedPocketBurst key={burst.key} x={burst.x} y={burst.y} />
      ))}
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
            transform: 'translateX(-100%)',
            filter: balloonFilters[balloon.color],
            animationPlayState: winnerTriggered ? 'paused' : 'running'
          }}
          onAnimationEnd={() => handleAnimationEnd(balloon.id)}
          onClick={(e) => handleBalloonPop(balloon.id, e)}
        />
      ))}
    </div>
  );
};

export default BalloonAnimation;
