import React from "react";
import styles from "./StartScreen.module.css";

interface StartScreenProps {
  onStart: () => void;
  show: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, show }) => {
  if (!show) return null;
  return (
    <div className={styles.overlay} style={{ zIndex: 1000 }}>
      <div style={{ padding: 40, textAlign: "center" }}>
        <img src="/redpocket.png" alt="Red Pocket" className={styles.redPocketImage} />
        <h1 className={styles.title}>Find a Red Pocket</h1>
        <p>Pop the balloons to win a red pocket!</p>
        <button
          className={styles.button}
          onClick={onStart}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
