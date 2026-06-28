import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import { getMonthlySummary, MonthlySummary } from '../../services/reportsService';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const formatColones = (value: number): string => {
    const rounded = Math.round(value);
    return '₡ ' + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function HomeScreen({ navigation }: any) {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [summary, setSummary] = useState<MonthlySummary | null>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let active = true;
            getMonthlySummary(month, year)
                .then((data) => { if (active) { setSummary(data); setLoading(false); } })
                .catch(() => { if (active) setLoading(false); });
            return () => { active = false; };
        }, [month, year])
    );

    const netProfit = summary?.netProfit ?? 0;
    const totalSales = summary?.totalSalesRevenue ?? 0;
    const totalExpenses = summary?.totalExpenses ?? 0;
    const hasData = summary !== null && (totalSales > 0 || totalExpenses > 0);

    return (
        <View style={s.container}>
            <ScreenHeader title="🥚 Eggs App" showBack={false} />

            <ScrollView contentContainerStyle={s.content}>
                <Text style={s.monthLabel}>{MONTH_NAMES[month - 1]} {year}</Text>

                <View style={s.mainCard}>
                    <Text style={s.mainCardLabel}>Ganancia del mes</Text>
                    {loading ? (
                        <ActivityIndicator color={theme.primary} style={{ marginVertical: 8 }} />
                    ) : (
                        <>
                            <Text style={[s.mainCardValue, { color: netProfit >= 0 ? theme.positive : theme.negative }]}>
                                {hasData ? formatColones(netProfit) : '₡ 0'}
                            </Text>
                            <Text style={s.mainCardSub}>
                                {hasData ? `${formatColones(totalSales)} en ventas` : 'Sin registros aún'}
                            </Text>
                        </>
                    )}
                </View>

                <View style={s.statsRow}>
                    <View style={s.statCard}>
                        <Text style={s.statLabel}>Ventas</Text>
                        {loading
                            ? <ActivityIndicator color={theme.primary} />
                            : <Text style={[s.statValue, { color: theme.positive }]}>{formatColones(totalSales)}</Text>
                        }
                    </View>
                    <View style={s.statCard}>
                        <Text style={s.statLabel}>Gastos</Text>
                        {loading
                            ? <ActivityIndicator color={theme.primary} />
                            : <Text style={[s.statValue, { color: theme.negative }]}>{formatColones(totalExpenses)}</Text>
                        }
                    </View>
                </View>

                {!loading && (summary?.pendingReceivables ?? 0) > 0 && (
                    <View style={[s.statCard, s.receivablesCard]}>
                        <Text style={s.statLabel}>Por cobrar (total)</Text>
                        <Text style={[s.statValue, { color: theme.warning }]}>
                            {formatColones(summary!.pendingReceivables)}
                        </Text>
                    </View>
                )}

                <Text style={s.sectionTitle}>ACCIONES RÁPIDAS</Text>

                <TouchableOpacity
                    style={s.primaryButton}
                    onPress={() => navigation.navigate('CreateSale')}
                >
                    <Ionicons name="add-circle-outline" size={22} color={theme.primaryText} />
                    <Text style={s.primaryButtonText}>Registrar venta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={s.secondaryButton}
                    onPress={() => navigation.navigate('CreateExpense')}
                >
                    <Ionicons name="cash-outline" size={22} color={theme.textPrimary} />
                    <Text style={s.secondaryButtonText}>Registrar gasto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={s.secondaryButton}
                    onPress={() => navigation.navigate('History')}
                >
                    <Ionicons name="time-outline" size={22} color={theme.textPrimary} />
                    <Text style={s.secondaryButtonText}>Ver historial</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={s.receivablesButton}
                    onPress={() => navigation.navigate('Receivables')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="wallet-outline" size={22} color={theme.warning} />
                    <Text style={s.receivablesButtonText}>Cuentas por cobrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={s.summaryButton}
                    onPress={() => navigation.navigate('Summary')}
                    activeOpacity={0.85}
                >
                    <Ionicons name="bar-chart-outline" size={28} color="#fff" />
                    <Text style={s.summaryButtonText}>Ver resumen de ganancias</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 16 },
    monthLabel: { fontSize: 14, color: theme.textPrimary, fontWeight: '500', marginBottom: 14 },
    mainCard: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 0.5,
        borderColor: theme.border,
    },
    mainCardLabel: { fontSize: 13, color: theme.textMuted, marginBottom: 4 },
    mainCardValue: { fontSize: 28, fontWeight: '500' },
    mainCardSub: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    statCard: {
        flex: 1,
        backgroundColor: theme.surface,
        borderRadius: 10,
        padding: 14,
        borderWidth: 0.5,
        borderColor: theme.border,
    },
    receivablesCard: {
        flex: 0,
        marginBottom: 20,
    },
    statLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: '500' },
    sectionTitle: {
        fontSize: 12,
        color: theme.textMuted,
        fontWeight: '500',
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    primaryButton: {
        backgroundColor: theme.primary,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 10,
    },
    primaryButtonText: { color: theme.primaryText, fontSize: 16, fontWeight: '500' },
    secondaryButton: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 0.5,
        borderColor: theme.border,
        marginBottom: 10,
    },
    secondaryButtonText: { color: theme.textPrimary, fontSize: 16 },
    receivablesButton: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderColor: theme.warning,
        marginBottom: 10,
        minHeight: 52,
    },
    receivablesButtonText: { color: theme.warning, fontSize: 16, fontWeight: '600' },
    summaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: theme.positive,
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginVertical: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    summaryButtonText: { fontSize: 20, fontWeight: '700', color: '#fff' },
});
