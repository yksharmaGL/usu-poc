'use client';
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function FormioThemeInitializer() {
  const theme = useTheme();

  useEffect(() => {
    import('../lib/formioPatchTheme').then(({ applyFormioTheme }) => {
      applyFormioTheme(theme);
    });
    // Optionally, register custom components here too (see previous guidance)
  }, [theme]);

  return null;
}
