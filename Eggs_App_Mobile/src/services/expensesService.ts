import client from '../api/client';

export interface Category {
    id: number;
    name: string;
}

export interface ExpenseItem {
    id: number;
    amount: number;
    categoryName: string | null;
    expenseDate: string;
    categoryId: number | null;
    otherText: string | null;
}

const formatDate = (d: Date): string =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const getCategories = async (): Promise<Category[]> => {
    const response = await client.get('/Categories');
    return response.data;
};

export const createExpense = async (
    amount: number,
    expenseDate: Date,
    categoryId?: number,
    otherText?: string
) => {
    const response = await client.post('/Expenses', {
        amount,
        expenseDate: formatDate(expenseDate),
        categoryId,
        otherText,
    });
    return response.data;
};

export const getExpenses = async (month: number, year: number): Promise<ExpenseItem[]> => {
    const response = await client.get(`/Expenses?month=${month}&year=${year}`);
    return response.data;
};

export const updateExpense = async (
    id: number,
    amount: number,
    expenseDate: Date,
    categoryId?: number,
    otherText?: string
): Promise<void> => {
    await client.put(`/Expenses/${id}`, {
        amount,
        expenseDate: formatDate(expenseDate),
        categoryId,
        otherText,
    });
};

export const deleteExpense = async (id: number): Promise<void> => {
    await client.delete(`/Expenses/${id}`);
};
