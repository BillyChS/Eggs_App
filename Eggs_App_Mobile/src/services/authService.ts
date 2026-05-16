import axios from 'axios';

const API_URL = 'http://192.168.100.125:7222/api';

const api = axios.create({
    baseURL: API_URL,
});

export const login = async (username: string, password: string) => {
    const response = await api.post('/Auth/login', { username, password });
    return response.data.token;
};

export const register = async (username: string, password: string) => {
    const response = await api.post('/Auth/register', { username, password, role: 'Admin' });
    return response.data;
};