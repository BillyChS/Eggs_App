import client from '../api/client';

export interface Category {
    id: number;
    name: string;
}

// Get predefined expense categories
export const getCategories = async (): Promise<Category[]> => {
    const response = await client.get('/Categories');
    return response.data;
};

// Create a new expense
export const createExpense = async (
    amount: number,
    expenseDate: Date,
    categoryId?: number,
    otherText?: string
) => {
    const response = await client.post('/Expenses', {
        amount,
        expenseDate: `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}-${String(expenseDate.getDate()).padStart(2, '0')}`,
        categoryId,
        otherText,
    });
    return response.data;
};

// Get all expenses for a given month and year
export const getExpenses = async (month: number, year: number) => {
    const response = await client.get(`/Expenses?month=${month}&year=${year}`);
    return response.data;
};
