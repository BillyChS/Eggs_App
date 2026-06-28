import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export interface AppRoute {
    /** Must match the React Navigation screen name exactly. */
    name: string;
    label: string;
    icon: ComponentProps<typeof Ionicons>['name'];
}

/** Single source of truth for all authenticated destinations. */
export const APP_ROUTES: AppRoute[] = [
    { name: 'Home',          label: 'Inicio',                   icon: 'home-outline' },
    { name: 'CreateSale',    label: 'Registrar venta',          icon: 'cart-outline' },
    { name: 'CreateExpense', label: 'Registrar gasto',          icon: 'receipt-outline' },
    { name: 'History',       label: 'Ver historial',            icon: 'time-outline' },
    { name: 'Receivables',   label: 'Cobros',           icon: 'wallet-outline' },
    { name: 'Summary',       label: 'Resumen General', icon: 'bar-chart-outline' },
];
