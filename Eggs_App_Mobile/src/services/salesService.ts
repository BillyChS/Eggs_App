import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.100.125:7222/api';

const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const createSale = async (cartonType: number, quantity: number, pricePerCarton: number) => {
    const headers = await getAuthHeader();
    const response = await axios.post(`${API_URL}/Sales`, { cartonType, quantity, pricePerCarton }, { headers });
    return response.data;
};

export const getSales = async (month: number, year: number) => {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_URL}/Sales?month=${month}&year=${year}`, { headers });
    return response.data;
};