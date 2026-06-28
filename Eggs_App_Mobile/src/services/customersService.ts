import client from '../api/client';

export interface CustomerSummary {
    id: number;
    name: string;
    phone: string | null;
    balance: number;
}

export interface AbonoItem {
    id: number;
    amount: number;
    abonoDate: string;
    note: string | null;
}

export interface PendingSaleDetail {
    id: number;
    saleDate: string;
    cartonType: number;
    quantity: number;
    totalAmount: number;
    abonosTotal: number;
    remainingBalance: number;
    abonos: AbonoItem[];
}

export interface CustomerDetail {
    id: number;
    name: string;
    phone: string | null;
    note: string | null;
    totalBalance: number;
    pendingSales: PendingSaleDetail[];
}

export const getCustomersWithBalance = async (): Promise<CustomerSummary[]> => {
    const { data } = await client.get('/Customers', { params: { withBalance: true } });
    return data;
};

export const getCustomerDetail = async (id: number): Promise<CustomerDetail> => {
    const { data } = await client.get(`/Customers/${id}`);
    return data;
};
