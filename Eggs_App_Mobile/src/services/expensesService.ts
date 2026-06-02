import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.100.125:7222/api';

// Helper to get the auth header with the stored JWT token
const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

// Create a new expense
export const createExpense = async (
    name: string,
    amount: number,
    description?: string,
    categoryId?: number
) => {
    const headers = await getAuthHeader();
    const response = await axios.post(
        `${API_URL}/Expenses`,
        { name, amount, description, categoryId },
        { headers }
    );
    return response.data;
};

// Get all expenses for a given month and year
export const getExpenses = async (month: number, year: number) => {
    const headers = await getAuthHeader();
    const response = await axios.get(
        `${API_URL}/Expenses?month=${month}&year=${year}`,
        { headers }
    );
    return response.data;
};