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
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

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
    const { theme } = useTheme();
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
    const [year, setYear] = useState(now.getFullYear());
    const [summary, setSummary] = useState<MonthlySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const s = makeStyles(theme);

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
        return () => { active = false; };
    }, [month, year]);

    const goToPreviousMonth = () => {
        if (month === 1) { setMonth(12); setYear(year - 1); }
        else setMonth(month - 1);
    };

    const goToNextMonth = () => {
        if (month === 12) { setMonth(1); setYear(year + 1); }
        else setMonth(month + 1);
    };

    const isEmpty =
        summary !== null &&
        summary.totalSalesRevenue === 0 &&
        summary.totalExpenses === 0;

    const profitPositive = (summary?.netProfit ?? 0) >= 0;

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <ScreenHeader title="Resumen mensual" />

            <ScrollView style={s.container} contentContainerStyle={s.content}>
                {/* Month / year picker */}
                <View style={s.picker}>
                    <TouchableOpacity style={s.arrow} onPress={goToPreviousMonth}>
                        <Text style={s.arrowText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={s.period}>
                        {MONTH_NAMES[month - 1]} {year}
                    </Text>
                    <TouchableOpacity style={s.arrow} onPress={goToNextMonth}>
                        <Text style={s.arrowText}>›</Text>
                    </TouchableOpacity>
                </View>

                {loading && (
                    <View style={s.centered}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={s.muted}>Cargando…</Text>
                    </View>
                )}

                {!loading && error && (
                    <View style={s.centered}>
                        <Text style={s.error}>{error}</Text>
                    </View>
                )}

                {!loading && !error && isEmpty && (
                    <View style={s.centered}>
                        <Text style={s.muted}>No hay ventas ni gastos en este mes.</Text>
                    </View>
                )}

                {!loading && !error && summary && !isEmpty && (
                    <>
                        {/* Sales revenue */}
                        <View style={s.card}>
                            <Text style={s.cardLabel}>Ventas del mes</Text>
                            <Text style={s.salesValue}>
                                {formatColones(summary.totalSalesRevenue)}
                            </Text>
                        </View>

                        {/* Expenses by category */}
                        <View style={s.card}>
                            <Text style={s.cardLabel}>Gastos por categoría</Text>
                            {summary.expensesByCategory.map((c) => (
                                <View key={c.category} style={s.expenseRow}>
                                    <Text style={s.expenseCategory}>{c.category}</Text>
                                    <Text style={s.expenseValue}>
                                        {formatColones(c.total)}
                                    </Text>
                                </View>
                            ))}
                            <View style={s.expenseTotalRow}>
                                <Text style={s.expenseTotalLabel}>Total gastos</Text>
                                <Text style={s.expenseTotalValue}>
                                    {formatColones(summary.totalExpenses)}
                                </Text>
                            </View>
                        </View>

                        {/* Net profit — highlighted */}
                        <View
                            style={[
                                s.profitCard,
                                { backgroundColor: profitPositive ? theme.positive : theme.negative },
                            ]}
                        >
                            <Text style={s.profitLabel}>Ganancia neta</Text>
                            <Text style={s.profitValue}>
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

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
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
        backgroundColor: theme.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.border,
    },
    arrowText: { fontSize: 30, color: theme.textPrimary, lineHeight: 34 },
    period: { fontSize: 20, fontWeight: '600', color: theme.textPrimary },
    centered: { alignItems: 'center', marginTop: 40 },
    muted: { fontSize: 18, color: theme.textMuted, marginTop: 12, textAlign: 'center' },
    error: { fontSize: 18, color: theme.negative, textAlign: 'center' },
    card: {
        backgroundColor: theme.surface,
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
    },
    cardLabel: { fontSize: 18, color: theme.textMuted, marginBottom: 8 },
    salesValue: { fontSize: 30, fontWeight: '700', color: theme.textPrimary },
    expenseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    expenseCategory: { fontSize: 18, color: theme.textPrimary },
    expenseValue: { fontSize: 18, color: theme.textPrimary, fontWeight: '500' },
    expenseTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: theme.border,
        marginTop: 8,
        paddingTop: 12,
    },
    expenseTotalLabel: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
    expenseTotalValue: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
    profitCard: { borderRadius: 14, padding: 24, alignItems: 'center', marginTop: 4 },
    profitLabel: { fontSize: 18, color: '#fff', marginBottom: 6 },
    profitValue: { fontSize: 36, fontWeight: '800', color: '#fff' },
});
