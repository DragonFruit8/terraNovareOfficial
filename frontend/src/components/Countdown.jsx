import React, { useState, useEffect } from "react";

const Countdown = () => {
  const targetDate = new Date("March 8, " + new Date().getFullYear() + " 00:00:00").getTime(); // March 8th, this year
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (ms) => {
    if (ms <= 0) return "🎉 Welcome to Terra'Novare! 🎉";

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
      ⏳ Opening on March 8th <br /> {formatTime(timeLeft)}
    </div>
  );
};

export default Countdown;
