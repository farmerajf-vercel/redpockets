"use client";
import React, { useEffect, useRef } from "react";

interface ConfettiBurst {
  x: number;
  y: number;
  key: number;
}

interface ConfettiProps {
  bursts: ConfettiBurst[];
}

const colors = ["#141b41", "#306bac", "#6f9ceb", "#98b9f2", "#918ef4"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const Confetti: React.FC<ConfettiProps> = ({ bursts }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number|null>(null);
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Add new bursts
    bursts.forEach(burst => {
      for (let i = 0; i < randomBetween(10, 20); i++) {
        let angle = Math.random() * Math.PI * 2;
        let speed = randomBetween(2, 6);
        particlesRef.current.push({
          x: burst.x,
          y: burst.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: randomBetween(3, 7),
          alpha: 1,
        });
      }
    });
    
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.05);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.alpha *= 0.96; // fade out
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }
      animationRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      if (typeof animationRef.current === 'number') {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [bursts]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export type { ConfettiBurst };
export default Confetti;
