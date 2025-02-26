import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return sessionStorage.getItem("theme") || "light"; // ✅ Load theme from sessionStorage
  });

  // Check user preference in localStorage or default to system theme
  // const getInitialTheme = () => {
  //   const storedTheme = localStorage.getItem("theme");
  //   if (storedTheme) return storedTheme;
  //   return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  // };
  
  useEffect(() => {
    document.body.className = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // ✅ Save theme to localStorage
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
