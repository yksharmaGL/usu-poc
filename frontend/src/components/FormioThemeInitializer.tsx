'use client';

import { applyFormioOverrides } from '@src/lib/formioOverrides';
import { useEffect } from 'react';

export default function FormioThemeInitializer() {
  useEffect(() => {
    const theme = process.env.NEXT_PUBLIC_FORMIO_THEME || 'default';
    applyFormioOverrides(theme);
  }, []);

  return null; // this component only runs the effect
}
