import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginService } from '../services/AuthService';

interface AuthContextType {
    token: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            const stored = await AsyncStorage.getItem('token');
            if (stored) setToken(stored);
            setIsLoading(false);
        };
        loadToken();
    }, []);

    const login = async (username: string, password: string) => {
        const jwt = await loginService(username, password);
        await AsyncStorage.setItem('token', jwt);
        setToken(jwt);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);