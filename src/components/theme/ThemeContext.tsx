'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

/** light = Gündüz Modu (varsayılan, buzlu beyaz-gri), dark = Gece Modu (siyah stüdyo görünümü). */
type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  isLight: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // Ön yükleme betiği data-theme'i zaten ayarladı; React durumunu onunla eşitle.
    const current = document.documentElement.getAttribute('data-theme');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidrasyon sonrası tarayıcı durumunu okuma
    if (current === 'dark') setThemeState('dark'); else setThemeState('light');
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('medyapr_theme', newTheme);
    } catch {
      // ignore localStorage errors
    }
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLight: theme === 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
