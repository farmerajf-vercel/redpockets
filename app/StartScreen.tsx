import React from "react";
import styles from "./Winner.module.css";

interface StartScreenProps {
  onStart: () => void;
  show: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, show }) => {
  if (!show) return null;
  return (
    <div className={styles.overlay} style={{ zIndex: 1000 }}>
      <div className={styles.winnerBox} style={{ padding: 40, textAlign: "center" }}>
        <h1>🎈 Welcome to the Balloon Game! 🎈</h1>
        <p>Pop the winning balloon to win a red pocket!</p>
        <button
          className={styles.button}
          style={{ marginTop: 32, fontSize: 24, padding: "16px 40px", cursor: "pointer" }}
          onClick={onStart}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
