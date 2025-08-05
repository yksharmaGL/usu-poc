'use client'
import { useState, useEffect } from "react";
import { useTheme } from '@src/context/ThemeContext';

export default function FormioThemeInitializer({ children }) {
  const theme = useTheme();
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    import('@src/lib/formioPatchTheme').then(({ applyFormioTheme }) => {
      const { Formio } = require('formiojs');
      if (Formio?.Templates?.bootstrap) {
        applyFormioTheme(theme);
        setThemeReady(true);
      } else {
        let attempts = 0;
        const maxAttempts = 20;
        const delay = 100;
        const interval = setInterval(() => {
          if (Formio?.Templates?.bootstrap) {
            applyFormioTheme(theme);
            setThemeReady(true);
            clearInterval(interval);
          } else if (++attempts >= maxAttempts) {
            clearInterval(interval);
            setThemeReady(true); // Fallback
          }
        }, delay);
      }
    });
  }, [theme]);

  if (!themeReady) return <div>Preparing theme...</div>;
  return children;
}
