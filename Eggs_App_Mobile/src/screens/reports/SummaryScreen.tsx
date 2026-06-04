import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getMonthlySummary, MonthlySummary } from '../../services/reportsService';
import HomeButton from '../../components/HomeButton';
import ScreenHeader from '../../components/ScreenHeader';

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Format a number as Costa Rican colones with thousands separators (e.g. ₡27.000)
const formatColones = (value: number): string => {
    const rounded = Math.round(value);
    const withSeparators = rounded
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `₡${withSeparators}`;
};

export default function SummaryScreen() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
    const [year, setYear] = useState(now.getFullYear());
    const [summary, setSummary] = useState<MonthlySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the summary whenever the selected period changes
    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getMonthlySummary(month, year);
                if (active) setSummary(data);
            } catch (e) {
                if (active) setError('No se pudo cargar el resumen. Revisá tu conexión.');
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, [month, year]);

    const goToPreviousMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const goToNextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    // No sales and no expenses for this period
    const isEmpty =
        summary !== null &&
        summary.totalSalesRevenue === 0 &&
        summary.totalExpenses === 0;

    const profitPositive = (summary?.netProfit ?? 0) >= 0;

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ScreenHeader title="Resumen mensual" />

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Month / year picker */}
                <View style={styles.picker}>
                    <TouchableOpacity style={styles.arrow} onPress={goToPreviousMonth}>
                        <Text style={styles.arrowText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.period}>
                        {MONTH_NAMES[month - 1]} {year}
                    </Text>
                    <TouchableOpacity style={styles.arrow} onPress={goToNextMonth}>
                        <Text style={styles.arrowText}>›</Text>
                    </TouchableOpacity>
                </View>

                {loading && (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color="#1a1a2e" />
                        <Text style={styles.muted}>Cargando…</Text>
                    </View>
                )}

                {!loading && error && (
                    <View style={styles.centered}>
                        <Text style={styles.error}>{error}</Text>
                    </View>
                )}

                {!loading && !error && isEmpty && (
                    <View style={styles.centered}>
                        <Text style={styles.muted}>
                            No hay ventas ni gastos en este mes.
                        </Text>
                    </View>
                )}

                {!loading && !error && summary && !isEmpty && (
                    <>
                        {/* Sales revenue */}
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Ventas del mes</Text>
                            <Text style={styles.salesValue}>
                                {formatColones(summary.totalSalesRevenue)}
                            </Text>
                        </View>

                        {/* Expenses by category */}
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Gastos por categoría</Text>
                            {summary.expensesByCategory.map((c) => (
                                <View key={c.category} style={styles.expenseRow}>
                                    <Text style={styles.expenseCategory}>{c.category}</Text>
                                    <Text style={styles.expenseValue}>
                                        {formatColones(c.total)}
                                    </Text>
                                </View>
                            ))}
                            <View style={styles.expenseTotalRow}>
                                <Text style={styles.expenseTotalLabel}>Total gastos</Text>
                                <Text style={styles.expenseTotalValue}>
                                    {formatColones(summary.totalExpenses)}
                                </Text>
                            </View>
                        </View>

                        {/* Net profit - highlighted */}
                        <View
                            style={[
                                styles.profitCard,
                                { backgroundColor: profitPositive ? '#1b873f' : '#c0392b' },
                            ]}
                        >
                            <Text style={styles.profitLabel}>Ganancia neta</Text>
                            <Text style={styles.profitValue}>
                                {formatColones(summary.netProfit)}
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>

            <HomeButton />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 20, paddingBottom: 100 },
    picker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    arrow: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    arrowText: { fontSize: 30, color: '#1a1a2e', lineHeight: 34 },
    period: { fontSize: 20, fontWeight: '600', color: '#1a1a2e' },
    centered: { alignItems: 'center', marginTop: 40 },
    muted: { fontSize: 18, color: '#666', marginTop: 12, textAlign: 'center' },
    error: { fontSize: 18, color: '#c0392b', textAlign: 'center' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
    },
    cardLabel: { fontSize: 18, color: '#666', marginBottom: 8 },
    salesValue: { fontSize: 30, fontWeight: '700', color: '#1a1a2e' },
    expenseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    expenseCategory: { fontSize: 18, color: '#1a1a2e' },
    expenseValue: { fontSize: 18, color: '#1a1a2e', fontWeight: '500' },
    expenseTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 8,
        paddingTop: 12,
    },
    expenseTotalLabel: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
    expenseTotalValue: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
    profitCard: { borderRadius: 14, padding: 24, alignItems: 'center', marginTop: 4 },
    profitLabel: { fontSize: 18, color: '#fff', marginBottom: 6 },
    profitValue: { fontSize: 36, fontWeight: '800', color: '#fff' },
});