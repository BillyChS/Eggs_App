import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from './colors';

type Mode = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
    theme: Theme; mode: Mode; isDark: boolean; setMode: (m: Mode) => void;
} | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const system = useColorScheme();
    const [mode, setModeState] = useState<Mode>('system');

    useEffect(() => {
        AsyncStorage.getItem('themeMode').then((s) => { if (s) setModeState(s as Mode); });
    }, []);

    const setMode = (m: Mode) => { setModeState(m); AsyncStorage.setItem('themeMode', m); };

    const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';
    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, mode, isDark, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
    return ctx;
};