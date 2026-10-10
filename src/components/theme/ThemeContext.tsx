'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'grey' | 'black-room';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isBlackRoom: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'grey',
  toggleTheme: () => {},
  setTheme: () => {},
  isBlackRoom: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('grey');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('adsviews_theme') as Theme | null;
      if (saved === 'black-room' || saved === 'grey') {
        setThemeState(saved);
        document.documentElement.setAttribute('data-theme', saved);
      } else {
        document.documentElement.setAttribute('data-theme', 'grey');
      }
    } catch {
      document.documentElement.setAttribute('data-theme', 'grey');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('adsviews_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch {
      // ignore localStorage errors
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'grey' ? 'black-room' : 'grey';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isBlackRoom: theme === 'black-room',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
