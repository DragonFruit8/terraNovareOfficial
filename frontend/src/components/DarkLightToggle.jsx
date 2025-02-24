import React, { useState, useEffect } from 'react';
import '../App.css'

// Toggle Button Component
const DarkLightToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load the mode from localStorage (so it persists on page reload)
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
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
        localStorage.setItem('darkMode', 'true'); // Save the mode to localStorage
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
      }
      return newMode;
    });
  };

  return (
    <button className="toggle-button" onClick={toggleMode}>
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkLightToggle;
