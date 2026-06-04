import client from '../api/client';

export const createSale = async (cartonType: number, quantity: number, pricePerCarton: number) => {
    const response = await client.post('/Sales', { cartonType, quantity, pricePerCarton });
    return response.data;
};

export const getSales = async (month: number, year: number) => {
    const response = await client.get(`/Sales?month=${month}&year=${year}`);
    return response.data;
};
