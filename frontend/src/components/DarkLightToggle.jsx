import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from "react-icons/fa6"
import '../App.css'

// Toggle Button Component
const DarkLightToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load the mode from localStorage (so it persists on page reload)
  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      setIsDarkMode(false);
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Toggle dark/light mode
  const toggleMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark'); // Save the mode to localStorage
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <button className="toggle-button" onClick={toggleMode}>
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default DarkLightToggle;
