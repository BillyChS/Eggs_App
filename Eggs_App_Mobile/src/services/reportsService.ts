import client from '../api/client';

export interface CategoryTotal {
    category: string;
    total: number;
}

export interface MonthlySummary {
    month: number;
    year: number;
    totalSalesRevenue: number;
    expensesByCategory: CategoryTotal[];
    totalExpenses: number;
    netProfit: number;
    pendingReceivables: number;
}

export const getMonthlySummary = async (
    month: number,
    year: number
): Promise<MonthlySummary> => {
    const response = await client.get(`/reports/summary?month=${month}&year=${year}`);
    return response.data;
};
