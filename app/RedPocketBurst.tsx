"use client";
import React, { useEffect, useRef } from "react";

interface RedPocketBurstProps {
  x: number;
  y: number;
  key: number;
  onComplete?: () => void;
}

const NUM_POCKETS = 36;
const FADE_DURATION = 900; // ms
const MIN_DIST = 120; // px
const MAX_DIST = 350; // px

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const RedPocketBurst: React.FC<RedPocketBurstProps> = ({ x, y, key: burstKey, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, FADE_DURATION);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        pointerEvents: "none",
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999
      }}
    >
      {Array.from({ length: NUM_POCKETS }).map((_, i) => {
        const angle = (i * 10) * (Math.PI / 180);
        const dist = randomBetween(MIN_DIST, MAX_DIST);
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        // Random speed: assign each pocket a random animation duration between 600ms and 1400ms
        const duration = randomBetween(600, 1400);
        return (
          <img
            key={i}
            src="/redpocket.png"
            alt="Red Pocket"
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 36,
              height: 48,
              pointerEvents: "none",
              zIndex: 10000,
              opacity: 0,
              animation: `redpocket-burst-${burstKey}-${i} ${duration}ms forwards`
            }}
            data-burst-duration={duration}
          />
        );
      })}
      <style>{`
        ${Array.from({ length: NUM_POCKETS }).map((_, i) => {
          const angle = (i * 10) * (Math.PI / 180);
          const dist = randomBetween(MIN_DIST, MAX_DIST);
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist;
          // Match the duration for each pocket's keyframes
          const duration = randomBetween(600, 1400);
          return `@keyframes redpocket-burst-${burstKey}-${i} {
            0% { opacity: 1; transform: translate(0px, 0px) scale(1); }
            100% { opacity: 0; transform: translate(${tx}px, ${ty}px) scale(1.1); }
          }`;
        }).join("\n")}
      `}</style>
    </div>
  );
};

export default RedPocketBurst;
export type { RedPocketBurstProps };
