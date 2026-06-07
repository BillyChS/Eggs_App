import client from '../api/client';

export interface SaleItem {
    id: number;
    cartonType: number;
    quantity: number;
    pricePerCarton: number;
    totalAmount: number;
    saleDate: string;
}

export const createSale = async (cartonType: number, quantity: number, pricePerCarton: number) => {
    const response = await client.post('/Sales', { cartonType, quantity, pricePerCarton });
    return response.data;
};

export const getSales = async (month: number, year: number): Promise<SaleItem[]> => {
    const response = await client.get(`/Sales?month=${month}&year=${year}`);
    return response.data;
};

export const updateSale = async (
    id: number,
    cartonType: number,
    quantity: number,
    pricePerCarton: number
): Promise<void> => {
    await client.put(`/Sales/${id}`, { cartonType, quantity, pricePerCarton });
};

export const deleteSale = async (id: number): Promise<void> => {
    await client.delete(`/Sales/${id}`);
};
