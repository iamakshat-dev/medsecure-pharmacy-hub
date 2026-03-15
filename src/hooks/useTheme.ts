import { useEffect, useRef, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  const toggle = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-transition');
      setIsTransitioning(true);

      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }

      transitionTimer.current = window.setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
        setIsTransitioning(false);
      }, 420);
    }

    const currentTheme = resolvedTheme ?? 'light';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return {
    isDark,
    mounted,
    isTransitioning,
    setTheme,
    toggle,
  };
}
