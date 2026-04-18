// Theme utility for light/dark mode functionality
// This utility applies to all pages in the application

export const initializeTheme = () => {
  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
};

export const toggleTheme = () => {
  // Toggle dark class on body
  document.body.classList.toggle("dark");

  // Save preference to localStorage
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};

export const getThemeIcon = () => {
  // Return the appropriate icon for the current theme
  const isDark = document.body.classList.contains("dark");
  return isDark ? "☀️" : "🌙";
};

export const getCurrentTheme = () => {
  // Return the current theme
  return document.body.classList.contains("dark") ? "dark" : "light";
};
