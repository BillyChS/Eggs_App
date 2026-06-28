import { Ionicons } from '@expo/vector-icons';
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
import MonthPickerModal from '../../components/MonthPickerModal';
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
    const [calendarVisible, setCalendarVisible] = useState(false);
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
            <ScreenHeader title="Resumen de ganancias" />

            <ScrollView style={s.container} contentContainerStyle={s.content}>
                {/* Month / year picker */}
                <View style={s.picker}>
                    <TouchableOpacity style={s.arrow} onPress={goToPreviousMonth}>
                        <Ionicons name="chevron-back" size={30} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={s.periodBtn} onPress={() => setCalendarVisible(true)}>
                        <Text style={s.period}>{MONTH_NAMES[month - 1]} {year}</Text>
                        <Ionicons name="calendar-outline" size={20} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={s.arrow} onPress={goToNextMonth}>
                        <Ionicons name="chevron-forward" size={30} color={theme.textPrimary} />
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
                        {/* Net profit — highlighted */}
                        <View
                            style={[
                                s.profitCard,
                                { backgroundColor: profitPositive ? theme.positive : theme.negative },
                            ]}
                        >
                            <Text style={s.profitLabel}>Ganancia neta (efectivo)</Text>
                            <Text style={s.profitValue}>
                                {formatColones(summary.netProfit)}
                            </Text>
                        </View>

                        {/* Sales revenue (paid only) */}
                        <View style={s.card}>
                            <Text style={s.cardLabel}>Ventas cobradas</Text>
                            <Text style={s.salesValue}>
                                {formatColones(summary.totalSalesRevenue)}
                            </Text>
                        </View>

                        {/* Pending receivables */}
                        {summary.pendingReceivables > 0 && (
                            <View style={[s.card, s.pendingCard]}>
                                <Text style={s.cardLabel}>Por cobrar (pendiente)</Text>
                                <Text style={[s.salesValue, { color: theme.warning }]}>
                                    {formatColones(summary.pendingReceivables)}
                                </Text>
                            </View>
                        )}

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
                    </>
                )}
            </ScrollView>

            <MonthPickerModal
                visible={calendarVisible}
                month={month}
                year={year}
                onSelect={(m, y) => { setMonth(m); setYear(y); setCalendarVisible(false); }}
                onClose={() => setCalendarVisible(false)}
            />
        </View>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 20, paddingBottom: 32 },
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
    periodBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
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
    pendingCard: { borderWidth: 1.5, borderColor: '#D97706' },
    profitCard: { borderRadius: 14, padding: 24, alignItems: 'center', marginBottom: 16 },
    profitLabel: { fontSize: 18, color: '#fff', marginBottom: 6 },
    profitValue: { fontSize: 36, fontWeight: '800', color: '#fff' },
});
