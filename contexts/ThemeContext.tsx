import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextState {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextState | undefined>(undefined);

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('color-theme');
        if (typeof storedPrefs === 'string') {
            return storedPrefs as Theme;
        }
        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (userMedia.matches) {
            return 'dark';
        }
    }
    return 'light';
};


export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    const applyTheme = useCallback((themeToApply: Theme) => {
        const root = window.document.documentElement;
        root.classList.remove(themeToApply === 'dark' ? 'light' : 'dark');
        root.classList.add(themeToApply);
        localStorage.setItem('color-theme', themeToApply);
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextState => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
