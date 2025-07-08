import React, { useEffect, useState } from "react";
import styles from "./Winner.module.css";
import RedPocketRain from "./RedPocketRain";

interface WinnerProps {
  visible: boolean;
  value?: number | null;
}

const Winner: React.FC<WinnerProps> = ({ visible, value }) => {
  const [showPrize, setShowPrize] = useState(false);
  const [coinSrc, setCoinSrc] = useState("/coinspin.gif");

  useEffect(() => {
    if (visible) {
      setShowPrize(false);
      setCoinSrc("/coinspin.gif");
      const timer = setTimeout(() => {
        setCoinSrc("/coin.png");
        setShowPrize(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <div className={styles.overlay}>
      {showPrize && <RedPocketRain />}
      <div className={styles.redpocket}>
        <img src="/redpocket.png" alt="Rock Pocket" />
      </div>
      <div className={styles.coin}>
        <img src={coinSrc} alt="Coin" />
      </div>
      {showPrize && (
        <>
          <div className={styles.prize}>
            ${value}
          </div>
          <div className={styles.comeBack}>Come back later for another go</div>
        </>
      )}
    </div>
  );
};

export default Winner;
