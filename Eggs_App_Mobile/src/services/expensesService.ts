import client from '../api/client';

// Create a new expense
export const createExpense = async (
    name: string,
    amount: number,
    description?: string,
    categoryId?: number
) => {
    const response = await client.post('/Expenses', { name, amount, description, categoryId });
    return response.data;
};

// Get all expenses for a given month and year
export const getExpenses = async (month: number, year: number) => {
    const response = await client.get(`/Expenses?month=${month}&year=${year}`);
    return response.data;
};
