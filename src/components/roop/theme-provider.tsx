import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ThemeContextValue = { dark: boolean; toggle: () => void };
const ThemeContext = createContext<ThemeContextValue>({ dark: false, toggle: () => undefined });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  // Read browser-only preferences after hydration so server rendering stays deterministic.
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("roop-rekha-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(savedTheme ? savedTheme === "dark" : prefersDark);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    window.localStorage.setItem("roop-rekha-theme", dark ? "dark" : "light");
  }, [dark, ready]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((value) => !value) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
