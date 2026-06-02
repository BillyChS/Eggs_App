import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.100.125:5243/api';

const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

// Shape of each expense category row in the summary
export interface CategoryTotal {
    category: string;
    total: number;
}

// Full monthly summary returned by GET /reports/summary
export interface MonthlySummary {
    month: number;
    year: number;
    totalSalesRevenue: number;
    expensesByCategory: CategoryTotal[];
    totalExpenses: number;
    netProfit: number;
}

export const getMonthlySummary = async (
    month: number,
    year: number
): Promise<MonthlySummary> => {
    const headers = await getAuthHeader();
    const response = await axios.get(
        `${API_URL}/reports/summary?month=${month}&year=${year}`,
        { headers }
    );
    return response.data;
};