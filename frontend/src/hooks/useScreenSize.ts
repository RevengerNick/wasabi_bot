// src/hooks/useScreenSize.ts
import { useState, useEffect } from 'react';

// Пороговое значение, например, 768px (стандарт для планшетов)
const DESKTOP_BREAKPOINT = 768;

export const useScreenSize = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= DESKTOP_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    
    // Очистка при размонтировании компонента
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isDesktop };
};