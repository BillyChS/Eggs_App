import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const client = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.100.125:5243/api',
});

// Attach the stored JWT token as a Bearer header before every request
client.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;
