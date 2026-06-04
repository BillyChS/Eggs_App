import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

export default function HomeScreen({ navigation }: any) {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    return (
        <View style={s.container}>
            <ScreenHeader title="🥚 Eggs App" showBack={false} />

            <ScrollView contentContainerStyle={s.content}>
                {/* Current month label */}
                <Text style={s.monthLabel}>Mayo 2026</Text>

                {/* Main profit card */}
                <View style={s.mainCard}>
                    <Text style={s.mainCardLabel}>Ganancia del mes</Text>
                    <Text style={s.mainCardValue}>₡ 0</Text>
                    <Text style={s.mainCardSub}>Sin registros aún</Text>
                </View>

                {/* Sales and expenses summary cards */}
                <View style={s.statsRow}>
                    <View style={s.statCard}>
                        <Text style={s.statLabel}>Ventas</Text>
                        <Text style={[s.statValue, { color: theme.positive }]}>₡ 0</Text>
                    </View>
                    <View style={s.statCard}>
                        <Text style={s.statLabel}>Gastos</Text>
                        <Text style={[s.statValue, { color: theme.negative }]}>₡ 0</Text>
                    </View>
                </View>

                <Text style={s.sectionTitle}>ACCIONES RÁPIDAS</Text>

                {/* Navigate to create sale screen */}
                <TouchableOpacity
                    style={s.primaryButton}
                    onPress={() => navigation.navigate('CreateSale')}
                >
                    <Text style={s.primaryButtonText}>+ Registrar venta</Text>
                </TouchableOpacity>

                {/* Navigate to create expense screen */}
                <TouchableOpacity
                    style={s.secondaryButton}
                    onPress={() => navigation.navigate('CreateExpense')}
                >
                    <Text style={s.secondaryButtonText}>− Registrar gasto</Text>
                </TouchableOpacity>

                {/* Navigate to summary screen */}
                <TouchableOpacity
                    style={s.summaryButton}
                    onPress={() => navigation.navigate('Summary')}
                    activeOpacity={0.85}
                >
                    <Text style={s.summaryIcon}>📊</Text>
                    <Text style={s.summaryButtonText}>Ver resumen mensual</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 16 },
    monthLabel: {
        fontSize: 14,
        color: theme.textPrimary,
        fontWeight: '500',
        marginBottom: 14,
    },
    mainCard: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 0.5,
        borderColor: theme.border,
    },
    mainCardLabel: { fontSize: 13, color: theme.textMuted, marginBottom: 4 },
    mainCardValue: { fontSize: 28, fontWeight: '500', color: theme.positive },
    mainCardSub: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    statCard: {
        flex: 1,
        backgroundColor: theme.surface,
        borderRadius: 10,
        padding: 14,
        borderWidth: 0.5,
        borderColor: theme.border,
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
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryButtonText: { color: theme.primaryText, fontSize: 16, fontWeight: '500' },
    secondaryButton: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: theme.border,
        marginBottom: 10,
    },
    secondaryButtonText: { color: theme.textPrimary, fontSize: 16 },
    summaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    summaryIcon: { fontSize: 24, marginRight: 12 },
    summaryButtonText: { fontSize: 20, fontWeight: '700', color: '#fff' },
});
