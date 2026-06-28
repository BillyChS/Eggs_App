import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import { useFeedback } from '../../hooks/useFeedback';
import { CustomerDetail, CustomerSummary, getCustomerDetail, getCustomersWithBalance } from '../../services/customersService';
import { createAbono, markSaleAsPaid } from '../../services/salesService';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

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

    const [customers, setCustomers] = useState<CustomerSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Detail modal state
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);
    const [detail, setDetail] = useState<CustomerDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Abono modal state
    const [abonoSaleId, setAbonoSaleId] = useState<number | null>(null);
    const [abonoMax, setAbonoMax] = useState(0);
    const [abonoAmount, setAbonoAmount] = useState('');
    const [abonoNote, setAbonoNote] = useState('');
    const [abonoLoading, setAbonoLoading] = useState(false);

    const loadCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCustomersWithBalance();
            setCustomers(data);
        } catch {
            // silent — empty list shown
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => {
        let active = true;
        setLoading(true);
        getCustomersWithBalance()
            .then((data) => { if (active) setCustomers(data); })
            .catch(() => {})
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []));

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return customers;
        return customers.filter(c => c.name.toLowerCase().includes(q));
    }, [customers, search]);

    const totalBalance = useMemo(() => customers.reduce((s, c) => s + c.balance, 0), [customers]);

    const openCustomer = async (customer: CustomerSummary) => {
        setSelectedCustomer(customer);
        setDetail(null);
        setDetailLoading(true);
        try {
            const d = await getCustomerDetail(customer.id);
            setDetail(d);
        } catch {
            showError('No se pudo cargar el detalle del cliente.');
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setSelectedCustomer(null);
        setDetail(null);
    };

    const openAbonoModal = (saleId: number, remaining: number) => {
        setAbonoSaleId(saleId);
        setAbonoMax(remaining);
        setAbonoAmount('');
        setAbonoNote('');
    };

    const closeAbonoModal = () => {
        setAbonoSaleId(null);
        setAbonoAmount('');
        setAbonoNote('');
    };

    const submitAbono = async () => {
        const amount = parseFloat(abonoAmount);
        if (!amount || amount <= 0) { showError('Ingresá un monto válido.'); return; }
        if (amount > abonoMax) { showError(`El monto no puede superar ${formatColones(abonoMax)}.`); return; }

        setAbonoLoading(true);
        try {
            await createAbono(abonoSaleId!, amount, abonoNote.trim() || undefined);
            closeAbonoModal();
            // Refresh detail and customer list
            if (selectedCustomer) {
                const [d, list] = await Promise.all([
                    getCustomerDetail(selectedCustomer.id),
                    getCustomersWithBalance(),
                ]);
                setDetail(d);
                setCustomers(list);
                if (d.totalBalance === 0) closeDetail();
            }
            showSuccess('Abono registrado correctamente.');
        } catch {
            showError('No se pudo registrar el abono.');
        } finally {
            setAbonoLoading(false);
        }
    };

    const handleMarkAsPaid = (saleId: number, remaining: number) => {
        showConfirm(
            '¿Confirmar pago total?',
            `Se registrará el pago completo de ${formatColones(remaining)}. Esta acción no se puede deshacer.`,
            async () => {
                try {
                    await markSaleAsPaid(saleId);
                    if (selectedCustomer) {
                        const [d, list] = await Promise.all([
                            getCustomerDetail(selectedCustomer.id),
                            getCustomersWithBalance(),
                        ]);
                        setDetail(d);
                        setCustomers(list);
                        if (d.totalBalance === 0) closeDetail();
                    }
                    showSuccess('Venta marcada como pagada.');
                } catch {
                    showError('No se pudo registrar el pago.');
                }
            }
        );
    };

    return (
        <View style={s.container}>
            <ScreenHeader title="Cuentas por cobrar" />

            <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
                {/* Total banner */}
                <View style={s.totalCard}>
                    <Text style={s.totalLabel}>Por cobrar</Text>
                    <Text style={s.totalValue}>{formatColones(totalBalance)}</Text>
                    {!loading && (
                        <Text style={s.totalSub}>
                            {customers.length === 0
                                ? 'Sin saldos pendientes'
                                : `${customers.length} cliente${customers.length !== 1 ? 's' : ''} con deuda`}
                        </Text>
                    )}
                </View>

                {/* Search bar */}
                <View style={s.searchBox}>
                    <Ionicons name="search-outline" size={18} color={theme.textMuted} style={s.searchIcon} />
                    <TextInput
                        style={s.searchInput}
                        placeholder="Buscar cliente..."
                        placeholderTextColor={theme.textMuted}
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                        autoCorrect={false}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator color={theme.primary} style={s.spinner} />
                ) : filtered.length === 0 ? (
                    <View style={s.emptyBox}>
                        <Ionicons
                            name={search ? 'search-outline' : 'checkmark-circle-outline'}
                            size={48}
                            color={search ? theme.textMuted : theme.positive}
                        />
                        <Text style={s.emptyText}>
                            {search
                                ? `Sin resultados para "${search}"`
                                : 'Todo al día, no hay deudas pendientes.'}
                        </Text>
                    </View>
                ) : (
                    filtered.map((c) => (
                        <TouchableOpacity key={c.id} style={s.customerCard} onPress={() => openCustomer(c)} activeOpacity={0.75}>
                            <View style={s.customerInfo}>
                                <Text style={s.customerName}>{c.name}</Text>
                                {c.phone && <Text style={s.customerPhone}>{c.phone}</Text>}
                            </View>
                            <View style={s.customerRight}>
                                <Text style={s.customerBalance}>{formatColones(c.balance)}</Text>
                                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* ── Customer Detail Modal ── */}
            <Modal
                visible={selectedCustomer !== null}
                transparent
                animationType="slide"
                onRequestClose={closeDetail}
            >
                <View style={s.detailOverlay}>
                    <View style={s.detailCard}>
                        <View style={s.detailHeader}>
                            <View>
                                <Text style={s.detailName}>{selectedCustomer?.name}</Text>
                                {selectedCustomer?.phone && (
                                    <Text style={s.detailPhone}>{selectedCustomer.phone}</Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={closeDetail} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                <Ionicons name="close" size={26} color={theme.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        {detail && (
                            <Text style={s.detailBalance}>
                                Balance: {formatColones(detail.totalBalance)}
                            </Text>
                        )}

                        <ScrollView style={s.detailScroll} showsVerticalScrollIndicator={false}>
                            {detailLoading ? (
                                <ActivityIndicator color={theme.primary} style={{ marginTop: 24 }} />
                            ) : detail?.pendingSales.length === 0 ? (
                                <Text style={s.emptyText}>Este cliente no tiene ventas pendientes.</Text>
                            ) : (
                                detail?.pendingSales.map((sale) => (
                                    <View key={sale.id} style={s.saleBlock}>
                                        <View style={s.saleBlockHeader}>
                                            <Text style={s.saleBlockDate}>{formatDate(sale.saleDate)}</Text>
                                            <Text style={s.saleBlockQty}>
                                                {sale.quantity} × cartón {sale.cartonType}
                                            </Text>
                                        </View>

                                        <View style={s.saleAmountRow}>
                                            <Text style={s.saleLabel}>Total venta</Text>
                                            <Text style={s.saleAmount}>{formatColones(sale.totalAmount)}</Text>
                                        </View>

                                        {sale.abonosTotal > 0 && (
                                            <View style={s.saleAmountRow}>
                                                <Text style={s.saleLabel}>Abonado</Text>
                                                <Text style={[s.saleAmount, { color: theme.positive }]}>
                                                    − {formatColones(sale.abonosTotal)}
                                                </Text>
                                            </View>
                                        )}

                                        <View style={[s.saleAmountRow, s.saleDivider]}>
                                            <Text style={[s.saleLabel, { fontWeight: '700' }]}>Pendiente</Text>
                                            <Text style={[s.saleAmount, { color: theme.warning, fontWeight: '700' }]}>
                                                {formatColones(sale.remainingBalance)}
                                            </Text>
                                        </View>

                                        {sale.abonos.length > 0 && (
                                            <View style={s.abonoList}>
                                                {sale.abonos.map((a) => (
                                                    <Text key={a.id} style={s.abonoEntry}>
                                                        {formatDate(a.abonoDate)} — {formatColones(a.amount)}
                                                        {a.note ? ` (${a.note})` : ''}
                                                    </Text>
                                                ))}
                                            </View>
                                        )}

                                        <View style={s.saleActions}>
                                            <TouchableOpacity
                                                style={s.abonoBtn}
                                                onPress={() => openAbonoModal(sale.id, sale.remainingBalance)}
                                                activeOpacity={0.75}
                                            >
                                                <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
                                                <Text style={s.abonoBtnText}>Registrar abono</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={s.payBtn}
                                                onPress={() => handleMarkAsPaid(sale.id, sale.remainingBalance)}
                                                activeOpacity={0.75}
                                            >
                                                <Ionicons name="cash-outline" size={18} color={theme.primaryText} />
                                                <Text style={s.payBtnText}>Pagar todo</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ── Abono Modal ── */}
            <Modal
                visible={abonoSaleId !== null}
                transparent
                animationType="fade"
                onRequestClose={closeAbonoModal}
            >
                <Pressable style={s.abonoOverlay} onPress={closeAbonoModal}>
                    <Pressable style={s.abonoCard} onPress={() => {}}>
                        <Text style={s.abonoTitle}>Registrar abono</Text>
                        <Text style={s.abonoSub}>Máximo: {formatColones(abonoMax)}</Text>

                        <Text style={s.fieldLabel}>Monto (₡)</Text>
                        <TextInput
                            style={s.input}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={theme.textMuted}
                            value={abonoAmount}
                            onChangeText={setAbonoAmount}
                            autoFocus
                        />

                        <Text style={s.fieldLabel}>Nota (opcional)</Text>
                        <TextInput
                            style={s.input}
                            placeholder="Ej: efectivo, transferencia..."
                            placeholderTextColor={theme.textMuted}
                            value={abonoNote}
                            onChangeText={setAbonoNote}
                        />

                        <TouchableOpacity
                            style={s.confirmBtn}
                            onPress={submitAbono}
                            disabled={abonoLoading}
                        >
                            {abonoLoading
                                ? <ActivityIndicator color={theme.primaryText} />
                                : <Text style={s.confirmBtnText}>Confirmar abono</Text>
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={closeAbonoModal} style={s.cancelLink}>
                            <Text style={s.cancelLinkText}>Cancelar</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

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
        marginBottom: 14,
        borderWidth: 0.5,
        borderColor: theme.border,
        alignItems: 'center',
    },
    totalLabel: { fontSize: 14, color: theme.textMuted, marginBottom: 4 },
    totalValue: { fontSize: 34, fontWeight: '700', color: theme.warning, marginBottom: 4 },
    totalSub: { fontSize: 14, color: theme.textMuted },

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.surface,
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: theme.border,
        paddingHorizontal: 12,
        marginBottom: 16,
        height: 48,
    },
    searchIcon: { marginRight: 8 },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: theme.textPrimary,
        height: 48,
    },

    spinner: { marginTop: 40 },

    emptyBox: { alignItems: 'center', marginTop: 48, gap: 12 },
    emptyText: { fontSize: 16, color: theme.textMuted, textAlign: 'center' },

    customerCard: {
        backgroundColor: theme.surface,
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: theme.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    customerInfo: { flex: 1 },
    customerName: { fontSize: 17, fontWeight: '700', color: theme.textPrimary },
    customerPhone: { fontSize: 14, color: theme.textMuted, marginTop: 2 },
    customerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    customerBalance: { fontSize: 17, fontWeight: '600', color: theme.warning },

    // Detail modal
    detailOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    detailCard: {
        backgroundColor: theme.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    detailName: { fontSize: 22, fontWeight: '700', color: theme.textPrimary },
    detailPhone: { fontSize: 14, color: theme.textMuted, marginTop: 2 },
    detailBalance: {
        fontSize: 16,
        color: theme.warning,
        fontWeight: '600',
        marginBottom: 16,
    },
    detailScroll: { flexGrow: 0 },

    saleBlock: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 0.5,
        borderColor: theme.border,
    },
    saleBlockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    saleBlockDate: { fontSize: 14, color: theme.textMuted },
    saleBlockQty: { fontSize: 14, color: theme.textMuted },
    saleAmountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    saleDivider: {
        borderTopWidth: 0.5,
        borderTopColor: theme.border,
        paddingTop: 6,
        marginTop: 4,
        marginBottom: 10,
    },
    saleLabel: { fontSize: 14, color: theme.textMuted },
    saleAmount: { fontSize: 14, color: theme.textPrimary },

    abonoList: { marginBottom: 10 },
    abonoEntry: { fontSize: 13, color: theme.textMuted, marginBottom: 2 },

    saleActions: { flexDirection: 'row', gap: 8 },
    abonoBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: theme.primary,
        borderRadius: 10,
        paddingVertical: 10,
    },
    abonoBtnText: { color: theme.primary, fontSize: 14, fontWeight: '600' },
    payBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: theme.primary,
        borderRadius: 10,
        paddingVertical: 10,
    },
    payBtnText: { color: theme.primaryText, fontSize: 14, fontWeight: '600' },

    // Abono modal
    abonoOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    abonoCard: {
        backgroundColor: theme.surface,
        borderRadius: 16,
        padding: 24,
        width: '100%',
    },
    abonoTitle: { fontSize: 20, fontWeight: '700', color: theme.textPrimary, marginBottom: 4 },
    abonoSub: { fontSize: 14, color: theme.textMuted, marginBottom: 16 },
    fieldLabel: { fontSize: 14, color: theme.textMuted, marginBottom: 6, marginTop: 12 },
    input: {
        backgroundColor: theme.background,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: theme.textPrimary,
    },
    confirmBtn: {
        backgroundColor: theme.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 20,
        minHeight: 52,
        justifyContent: 'center',
    },
    confirmBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: '600' },
    cancelLink: { alignItems: 'center', marginTop: 12 },
    cancelLinkText: { fontSize: 15, color: theme.textMuted },
});
