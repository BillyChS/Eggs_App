import axios from 'axios';

const API_URL = 'http://192.168.100.125:5243/api';

const api = axios.create({
    baseURL: API_URL,
});

export const login = async (username: string, password: string) => {
    console.log('🔐 Intentando login con:', username);
    try {
        const response = await api.post('/Auth/login', { username, password });
        console.log('✅ Token recibido:', response.data.token);
        return response.data.token;
    } catch (error) {
        console.log('❌ Error en login:', error);
        throw error;
    }
};

export const register = async (username: string, password: string) => {
    const response = await api.post('/Auth/register', { username, password, role: 'Admin' });
    return response.data;
};

