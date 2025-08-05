'use client';
import { createContext, useContext } from "react";

const ThemeContext = createContext(process.env.NEXT_PUBLIC_FORMIO_THEME || "default");

export function ThemeProvider({ children }) {
  const theme = process.env.NEXT_PUBLIC_FORMIO_THEME || "default";
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
