
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const temas = {
    light: {
        background: '#F5F5F5',
        surface: '#FFFFFF',
        surfaceSecondary: '#E5E5E5',
        primary: '#65A30D',
        primaryHover: '#84CC16',
        text: '#171717',
        textSecondary: '#737373',
        border: '#D4D4D4'
    },
    'midnight-blue': {
        background: '#0B1020',
        surface: '#151D35',
        surfaceSecondary: '#202D4D',
        primary: '#3B82F6',
        primaryHover: '#60A5FA',
        text: '#EAF1FF',
        textSecondary: '#A8B5D1',
        border: '#2D3B5C'
    },
    'midnight-dark': {
        background: '#111111',
        surface: '#1B1B1B',
        surfaceSecondary: '#292929',
        primary: '#A3E635',
        primaryHover: '#BEF264',
        text: '#F5F5F5',
        textSecondary: '#A3A3A3',
        border: '#343434'
    }
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');

        return temas[savedTheme] ? savedTheme : 'midnight-dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        const cores = temas[theme];

        root.setAttribute('data-theme', theme);

        Object.entries(cores).forEach(([key, value]) => {
            const cssName = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            root.style.setProperty(`--${cssName}`, value);
        });

        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
