import client from '../api/client';

export const login = async (username: string, password: string) => {
    const response = await client.post('/Auth/login', { username, password });
    return response.data.token;
};

export const register = async (username: string, password: string) => {
    const response = await client.post('/Auth/register', { username, password, role: 'Admin' });
    return response.data;
};
