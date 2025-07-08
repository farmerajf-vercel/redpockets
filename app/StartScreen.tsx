import React, { useEffect, useState } from "react";
import styles from "./StartScreen.module.css";

interface StartScreenProps {
  onStart: () => void;
  show: boolean;
}

import { useWinEvents } from "./WinEventsContext";

const StartScreen: React.FC<StartScreenProps> = ({ onStart, show }) => {
  const { events, loading, error } = useWinEvents();

  if (!show) return null;
  return (
    <div className={styles.overlay} style={{ zIndex: 1000 }}>
      <div style={{ padding: 40, textAlign: "center" }}>
        <img src="/redpocket.png" alt="Red Pocket" className={styles.redPocketImage} />
        <h1 className={styles.title}>Find a Red Pocket</h1>
        <p>Pop the balloons to win a red pocket!</p>
        {!loading && !error && (() => {
          const now = new Date().getTime();
          const available = events.find(ev => !ev.won && new Date(ev.earliestWin).getTime() <= now);
          if (available) {
            return (
              <button
                className={styles.button}
                onClick={onStart}
              >
                Start
              </button>
            );
          } else {
            // Find the soonest upcoming event
            const futureEvents = events.filter(ev => !ev.won && new Date(ev.earliestWin).getTime() > now);
            if (futureEvents.length === 0) {
              return <div>No more plays available.</div>;
            }
            const next = futureEvents.reduce((min, ev) => new Date(ev.earliestWin).getTime() < new Date(min.earliestWin).getTime() ? ev : min, futureEvents[0]);
            const minutes = Math.ceil((new Date(next.earliestWin).getTime() - now) / 60000);
            return <div style={{ color: '#ff0033', paddingTop: 8 }}>Next play available in {minutes} minute{minutes !== 1 ? 's' : ''}.</div>;
          }
        })()}

      </div>
    </div>
  );
};

export default StartScreen;
