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
import { useFeedback } from '../../hooks/useFeedback';
import { getPendingSales, markSaleAsPaid, PendingSaleItem } from '../../services/salesService';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

const MONTH_NAMES = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const formatDate = (iso: string): string => {
    const [y, m, d] = iso.split('T')[0].split('-').map(Number);
    return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
};

const formatColones = (v: number): string =>
    '₡ ' + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default function ReceivablesScreen() {
    const { theme } = useTheme();
    const { showConfirm, showError, showSuccess, FeedbackUI } = useFeedback();
    const s = makeStyles(theme);

    const [sales, setSales] = useState<PendingSaleItem[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let active = true;
            setLoading(true);
            getPendingSales()
                .then((data) => { if (active) { setSales(data); setLoading(false); } })
                .catch(() => { if (active) setLoading(false); });
            return () => { active = false; };
        }, [])
    );

    const handleMarkAsPaid = (item: PendingSaleItem) => {
        showConfirm(
            '¿Confirmar pago?',
            `${item.customerName} pagó ${formatColones(item.totalAmount)}. Esta acción no se puede deshacer.`,
            async () => {
                try {
                    await markSaleAsPaid(item.id);
                    setSales((prev) => prev.filter((s) => s.id !== item.id));
                    showSuccess(`Venta de ${item.customerName} marcada como pagada.`);
                } catch {
                    showError('No se pudo registrar el pago. Intentá de nuevo.');
                }
            }
        );
    };

    const total = sales.reduce((sum, s) => sum + s.totalAmount, 0);

    return (
        <View style={s.container}>
            <ScreenHeader title="Cuentas por cobrar" />

            <ScrollView contentContainerStyle={s.content}>
                {/* Total banner */}
                <View style={s.totalCard}>
                    <Text style={s.totalLabel}>Por cobrar</Text>
                    <Text style={s.totalValue}>{formatColones(total)}</Text>
                    {!loading && (
                        <Text style={s.totalSub}>
                            {sales.length === 0
                                ? 'Sin ventas pendientes'
                                : `${sales.length} venta${sales.length !== 1 ? 's' : ''} pendiente${sales.length !== 1 ? 's' : ''}`}
                        </Text>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator color={theme.primary} style={s.spinner} />
                ) : sales.length === 0 ? (
                    <View style={s.emptyBox}>
                        <Ionicons name="checkmark-circle-outline" size={48} color={theme.positive} />
                        <Text style={s.emptyText}>Todo al día, no hay deudas pendientes.</Text>
                    </View>
                ) : (
                    sales.map((item) => (
                        <View key={item.id} style={s.row}>
                            <View style={s.rowInfo}>
                                <Text style={s.rowName}>{item.customerName}</Text>
                                <Text style={s.rowDate}>{formatDate(item.saleDate)}</Text>
                                <Text style={s.rowAmount}>{formatColones(item.totalAmount)}</Text>
                            </View>
                            <TouchableOpacity
                                style={s.payBtn}
                                onPress={() => handleMarkAsPaid(item)}
                                activeOpacity={0.75}
                            >
                                <Ionicons name="cash-outline" size={20} color={theme.primaryText} />
                                <Text style={s.payBtnText}>Marcar como pagado</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            {FeedbackUI}
        </View>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 16, paddingBottom: 32 },

    totalCard: {
        backgroundColor: theme.surface,
        borderRadius: 14,
        padding: 20,
        marginBottom: 20,
        borderWidth: 0.5,
        borderColor: theme.border,
        alignItems: 'center',
    },
    totalLabel: { fontSize: 14, color: theme.textMuted, marginBottom: 4 },
    totalValue: { fontSize: 34, fontWeight: '700', color: theme.warning, marginBottom: 4 },
    totalSub: { fontSize: 14, color: theme.textMuted },

    spinner: { marginTop: 40 },

    emptyBox: { alignItems: 'center', marginTop: 48, gap: 12 },
    emptyText: { fontSize: 17, color: theme.textMuted, textAlign: 'center' },

    row: {
        backgroundColor: theme.surface,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderWidth: 0.5,
        borderColor: theme.border,
    },
    rowInfo: { marginBottom: 12 },
    rowName: { fontSize: 18, fontWeight: '700', color: theme.textPrimary, marginBottom: 2 },
    rowDate: { fontSize: 14, color: theme.textMuted, marginBottom: 4 },
    rowAmount: { fontSize: 22, fontWeight: '600', color: theme.warning },

    payBtn: {
        backgroundColor: theme.primary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 52,
    },
    payBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: '600' },
});
