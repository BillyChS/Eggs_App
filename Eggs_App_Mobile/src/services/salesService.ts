import client from '../api/client';

export type PaymentStatus = 'Paid' | 'Pending';

export interface SaleItem {
    id: number;
    cartonType: number;
    quantity: number;
    pricePerCarton: number;
    totalAmount: number;
    saleDate: string;
    paymentStatus: PaymentStatus;
    customerName: string | null;
    paidDate: string | null;
}

export interface PendingSaleItem {
    id: number;
    customerName: string;
    totalAmount: number;
    saleDate: string;
}

export const createSale = async (
    cartonType: number,
    quantity: number,
    pricePerCarton: number,
    paymentStatus: PaymentStatus = 'Paid',
    customerName?: string
) => {
    const response = await client.post('/Sales', {
        cartonType,
        quantity,
        pricePerCarton,
        paymentStatus,
        customerName: customerName ?? null,
    });
    return response.data;
};

export const getSales = async (month: number, year: number): Promise<SaleItem[]> => {
    const response = await client.get(`/Sales?month=${month}&year=${year}`);
    return response.data;
};

export const getPendingSales = async (): Promise<PendingSaleItem[]> => {
    const response = await client.get('/Sales/pending');
    return response.data;
};

export const markSaleAsPaid = async (id: number): Promise<void> => {
    await client.post(`/Sales/${id}/pay`);
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
