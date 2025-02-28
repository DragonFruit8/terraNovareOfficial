import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa6";
import "../App.css";

const DarkLightToggle = () => {
  // ✅ Load the mode from localStorage (default to system preference)
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme === "dark"; // Convert to boolean
    return window.matchMedia("(prefers-color-scheme: dark)").matches; // Default to system preference
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // ✅ Apply theme on mount & listen for changes
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // ✅ Toggle function
  const toggleMode = () => setIsDarkMode(prev => !prev);

  return (
    <button className="toggle-button" onClick={toggleMode}>
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default DarkLightToggle;