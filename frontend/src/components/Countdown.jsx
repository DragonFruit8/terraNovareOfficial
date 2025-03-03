import React, { useState, useEffect } from "react";

const Countdown = () => {
  const targetDate = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [targetDate]);

  const formatTime = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div style={{
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#FFD140",
      textAlign: "center",
      padding: "20px",
      border: "2px solid #FFD140",
      borderRadius: "10px",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "inline-block"
    }}>
      ⏳ Countdown: {formatTime(timeLeft)}
    </div>
  );
};

export default Countdown;
