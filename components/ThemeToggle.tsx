"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-xl bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-200">
        <Moon size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white/30 dark:bg-white/5 
        border border-white/20 dark:border-white/10
        text-gray-500 dark:text-gray-400 
        hover:bg-white/50 dark:hover:bg-white/10 
        transition-all duration-200"
      title={
        theme === "light" ? "Aktifkan Dark Mode" : "Aktifkan Light Mode"
      }
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
