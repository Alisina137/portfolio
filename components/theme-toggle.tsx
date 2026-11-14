"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

type Theme = "light" | "dark";

function getCurrentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" :
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" :
    window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const sync = () => setTheme(getCurrentTheme());
    sync();
    const matcher = window.matchMedia("(prefers-color-scheme: light)");
    matcher.addEventListener("change", sync);
    return () => matcher.removeEventListener("change", sync);
  }, []);

  const switchTheme = () => {
    const next: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("portfolio-theme", next); } catch { /* storage denied: current tab still works */ }
    setTheme(next);
  };

  return <button type="button" className="icon-button theme-toggle" onClick={switchTheme}
    aria-label={theme ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Toggle light and dark theme"}
    title="Change color theme">
    <span className="theme-icon-sun"><SunIcon /></span>
    <span className="theme-icon-moon"><MoonIcon /></span>
  </button>;
}
