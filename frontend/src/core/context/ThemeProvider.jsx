import React, { createContext, useContext, useEffect } from 'react';
import { useConfig } from './ConfigContext';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

export const ThemeProvider = ({ children }) => {
    const { config } = useConfig();
    const resolvedTheme = config?.theme || 'dark';

    const isDark = resolvedTheme === 'dark' || 
                   (resolvedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDark]);

    // Theme toggle is now handled by updating User preferences via API,
    // so we expose a mock toggleTheme to prevent existing UI from crashing
    // before we wire them up to userService.
    const toggleTheme = () => {
        console.warn("Theme toggle should now be performed by updating User profile preferences.");
    };

    return (
        <ThemeContext.Provider value={{ theme: resolvedTheme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
