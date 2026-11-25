import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const TEMAS_VALIDOS = ['dark', 'light', 'midnight-dark', 'midnight-blue'];
const TEMA_PADRAO = 'dark';
const CHAVE = 'theme'; // mesma chave que você já usa

const ThemeContext = createContext(null);

function temaInicial() {
    try {
        const salvo = localStorage.getItem(CHAVE);
        return TEMAS_VALIDOS.includes(salvo) ? salvo : TEMA_PADRAO;
    } catch {
        return TEMA_PADRAO;
    }
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(temaInicial);

    // ignora ids inválidos em vez de quebrar
    const setTheme = (novo) => {
        if (TEMAS_VALIDOS.includes(novo)) setThemeState(novo);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(CHAVE, theme);
        } catch {
            // localStorage indisponível (modo privado, por exemplo)
        }
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
    return ctx;
}
