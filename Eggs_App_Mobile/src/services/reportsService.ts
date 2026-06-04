import client from '../api/client';

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
    const response = await client.get(`/reports/summary?month=${month}&year=${year}`);
    return response.data;
};
