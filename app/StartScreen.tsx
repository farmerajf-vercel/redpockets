import React, { useEffect, useState } from "react";
import styles from "./StartScreen.module.css";

interface StartScreenProps {
  onStart: () => void;
  show: boolean;
}

interface WinEvent {
  id: number;
  value: number;
  won: boolean;
  earliestWin: string;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, show }) => {
  const [events, setEvents] = useState<WinEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;
    setLoading(true);
    fetch("/api/winevents")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch win events");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [show]);

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
