"use client";
import React, { useState } from "react";
import BalloonAnimation from "./BalloonAnimation";
import StartScreen from "./StartScreen";
import { WinEventsProvider, useWinEvents } from "./WinEventsContext";

function BalloonContent({ started, setStarted }: { started: boolean; setStarted: (v: boolean) => void }) {
  const { events } = useWinEvents();
  const now = Date.now();
  const available = events.find(ev => !ev.won && new Date(ev.earliestWin).getTime() <= now) || null;
  return (
    <>
      <StartScreen show={!started} onStart={() => setStarted(true)} />
      <BalloonAnimation gameStarted={started} currentWinEvent={available} />
    </>
  );
}

export default function BalloonWrapper() {
  const [started, setStarted] = useState(false);
  return (
    <WinEventsProvider>
      <BalloonContent started={started} setStarted={setStarted} />
    </WinEventsProvider>
  );
}
