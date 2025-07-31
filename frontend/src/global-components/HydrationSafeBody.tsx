'use client';

import { useEffect, useState } from 'react';

interface HydrationSafeBodyProps {
  children: React.ReactNode;
  className?: string;
}

export default function HydrationSafeBody({ children, className }: HydrationSafeBodyProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Return minimal structure for SSR
    return (
      <div className={className} suppressHydrationWarning>
        {children}
      </div>
    );
  }

  // Return full structure after hydration
  return (
    <div className={className}>
      {children}
    </div>
  );
}
