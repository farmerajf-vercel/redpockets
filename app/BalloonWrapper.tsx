"use client";
import React, { useState } from "react";
import BalloonAnimation from "./BalloonAnimation";
import StartScreen from "./StartScreen";

export default function BalloonWrapper() {
  const [started, setStarted] = useState(false);

  return (
    <>
      <StartScreen show={!started} onStart={() => setStarted(true)} />
      <BalloonAnimation gameStarted={started} />
    </>
  );
}
