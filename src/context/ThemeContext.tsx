import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Theme } from '@/types/ui';
// src/context/ThemeContext.tsx
import type React from 'react';
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Detect system preference for dark mode
  const detectSystemTheme = (): Theme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  };

  const [theme, setThemeValue] = useLocalStorage<Theme>(
    'diprush-theme',
    'light'
  );
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
    detectSystemTheme() === 'dark' ? 'dark' : 'light'
  );

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove both classes first
    root.classList.remove('light', 'dark');

    // Apply the appropriate theme
    const appliedTheme = theme === 'system' ? systemTheme : theme;
    root.classList.add(appliedTheme);
  }, [theme, systemTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return undefined;
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeValue(newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setThemeValue('dark');
    } else if (theme === 'dark') {
      setThemeValue('system');
    } else {
      setThemeValue('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
