import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
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
import MonthPickerModal from '../../components/MonthPickerModal';
import ScreenHeader from '../../components/ScreenHeader';
import { useFeedback } from '../../hooks/useFeedback';
import { deleteExpense, getCategories, getExpenses, updateExpense, Category, ExpenseItem } from '../../services/expensesService';
import { deleteSale, getSales, updateSale, SaleItem } from '../../services/salesService';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const OTHER_ID = -1;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const formatDate = (iso: string): string => {
    const [y, m, d] = iso.split('T')[0].split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return `${DAY_NAMES[date.getDay()]} ${d} ${MONTH_NAMES[m - 1].slice(0, 3).toLowerCase()}`;
};

const formatDateFull = (d: Date): string =>
    `${DAY_NAMES[d.getDay()]} ${d.getDate()} de ${MONTH_NAMES[d.getMonth()].toLowerCase()} ${d.getFullYear()}`;

const formatColones = (v: number): string =>
    '₡ ' + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const today = (): Date => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (d: Date, n: number): Date => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + n);
    return copy;
};

const parseIsoDate = (iso: string): Date => {
    const [y, m, d] = iso.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d);
};

type Tab = 'sales' | 'expenses';

export default function HistoryScreen() {
    const { theme } = useTheme();
    const { showConfirm, showError, showSuccess, FeedbackUI } = useFeedback();
    const s = makeStyles(theme);

    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [tab, setTab] = useState<Tab>('sales');

    const [sales, setSales] = useState<SaleItem[]>([]);
    const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    const [viewSale, setViewSale] = useState<SaleItem | null>(null);
    const [viewExpense, setViewExpense] = useState<ExpenseItem | null>(null);

    const [editSale, setEditSale] = useState<SaleItem | null>(null);
    const [editExpense, setEditExpense] = useState<ExpenseItem | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const [eCartonType, setECartonType] = useState<15 | 30>(15);
    const [eQuantity, setEQuantity] = useState('');
    const [ePrice, setEPrice] = useState('');

    const [eAmount, setEAmount] = useState('');
    const [eDate, setEDate] = useState<Date>(today());
    const [eSelectedId, setESelectedId] = useState<number | null>(null);
    const [eOtherText, setEOtherText] = useState('');
    const [eCatPickerVisible, setECatPickerVisible] = useState(false);

    useEffect(() => {
        getCategories().then(setCategories).catch(() => {});
    }, []);

    useFocusEffect(
        useCallback(() => {
            let active = true;
            setLoading(true);
            Promise.all([getSales(month, year), getExpenses(month, year)])
                .then(([s, e]) => { if (active) { setSales(s); setExpenses(e); } })
                .catch(() => {})
                .finally(() => { if (active) setLoading(false); });
            return () => { active = false; };
        }, [month, year])
    );

    const goToPrev = () => {
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const goToNext = () => {
        if (month === 12) { setMonth(1); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    const openEditSale = (item: SaleItem) => {
        setECartonType(item.cartonType as 15 | 30);
        setEQuantity(String(item.quantity));
        setEPrice(String(item.pricePerCarton));
        setEditSale(item);
    };

    const openEditExpense = (item: ExpenseItem) => {
        setEAmount(String(item.amount));
        setEDate(parseIsoDate(item.expenseDate));
        setESelectedId(item.categoryId !== null ? item.categoryId : OTHER_ID);
        setEOtherText(item.otherText ?? '');
        setEditExpense(item);
    };

    const submitEditSale = async () => {
        if (!eQuantity || !ePrice) { showError('Por favor completá todos los campos.'); return; }
        const qty = parseInt(eQuantity);
        const price = parseFloat(ePrice);
        setEditLoading(true);
        try {
            await updateSale(editSale!.id, eCartonType, qty, price);
            setSales(prev => prev.map(item =>
                item.id === editSale!.id
                    ? { ...item, cartonType: eCartonType, quantity: qty, pricePerCarton: price, totalAmount: qty * price }
                    : item
            ));
            setEditSale(null);
            showSuccess('Venta actualizada.');
        } catch (error) {
            showError('No se pudo actualizar la venta.');
        } finally {
            setEditLoading(false);
        }
    };

    const submitEditExpense = async () => {
        if (!eAmount || parseFloat(eAmount) <= 0) { showError('Ingresá un monto válido.'); return; }
        if (eSelectedId === OTHER_ID && !eOtherText.trim()) { showError('El campo "Otro" no puede ir vacío.'); return; }
        const amt = parseFloat(eAmount);
        const catId = eSelectedId !== null && eSelectedId !== OTHER_ID ? eSelectedId : undefined;
        const other = eSelectedId === OTHER_ID ? eOtherText.trim() : undefined;
        setEditLoading(true);
        try {
            await updateExpense(editExpense!.id, amt, eDate, catId, other);
            setEditExpense(null);
            const data = await getExpenses(month, year);
            setExpenses(data);
            showSuccess('Gasto actualizado.');
        } catch (error) {
            showError('No se pudo actualizar el gasto.');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteSale = (id: number) => {
        showConfirm('¿Eliminar venta?', 'Esta acción no se puede deshacer.', async () => {
            try {
                await deleteSale(id);
                setSales(prev => prev.filter(item => item.id !== id));
                showSuccess('Venta eliminada.');
            } catch (error) {
                showError('No se pudo eliminar la venta.');
            }
        });
    };

    const handleDeleteExpense = (id: number) => {
        showConfirm('¿Eliminar gasto?', 'Esta acción no se puede deshacer.', async () => {
            try {
                await deleteExpense(id);
                setExpenses(prev => prev.filter(item => item.id !== id));
                showSuccess('Gasto eliminado.');
            } catch (error) {
                showError('No se pudo eliminar el gasto.');
            }
        });
    };

    const eTotal = (parseInt(eQuantity) || 0) * (parseFloat(ePrice) || 0);
    const eIsToday = eDate.toDateString() === today().toDateString();
    const editSelectedLabel =
        eSelectedId === OTHER_ID
            ? `Otro: ${eOtherText || '…'}`
            : eSelectedId !== null
            ? categories.find(c => c.id === eSelectedId)?.name ?? 'Seleccionar categoría'
            : 'Seleccionar categoría';

    const renderSaleRow = (item: SaleItem) => (
        <View key={item.id} style={s.row}>
            <View style={s.rowMain}>
                <Text style={s.rowDate}>{formatDate(item.saleDate)}</Text>
                <Text style={s.rowTitle}>Cartón {item.cartonType} u. × {item.quantity}</Text>
            </View>
            <Text style={[s.rowAmount, { color: theme.positive }]}>
                {formatColones(item.totalAmount)}
            </Text>
            <View style={s.rowActions}>
                <TouchableOpacity style={s.iconBtn} onPress={() => setViewSale(item)} hitSlop={HIT}>
                    <Text style={s.iconText}>🔍</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.iconBtn} onPress={() => openEditSale(item)} hitSlop={HIT}>
                    <Text style={s.iconText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.iconBtn} onPress={() => handleDeleteSale(item.id)} hitSlop={HIT}>
                    <Text style={s.iconText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderExpenseRow = (item: ExpenseItem) => (
        <View key={item.id} style={s.row}>
            <View style={s.rowMain}>
                <Text style={s.rowDate}>{formatDate(item.expenseDate)}</Text>
                <Text style={s.rowTitle}>{item.categoryName ?? 'Sin categoría'}</Text>
            </View>
            <Text style={[s.rowAmount, { color: theme.negative }]}>
                {formatColones(item.amount)}
            </Text>
            <View style={s.rowActions}>
                <TouchableOpacity style={s.iconBtn} onPress={() => setViewExpense(item)} hitSlop={HIT}>
                    <Text style={s.iconText}>🔍</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.iconBtn} onPress={() => openEditExpense(item)} hitSlop={HIT}>
                    <Text style={s.iconText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.iconBtn} onPress={() => handleDeleteExpense(item.id)} hitSlop={HIT}>
                    <Text style={s.iconText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={s.container}>
            <ScreenHeader title="Historial" />

            <ScrollView contentContainerStyle={s.content}>
                <View style={s.picker}>
                    <TouchableOpacity style={s.arrow} onPress={goToPrev}>
                        <Text style={s.arrowText}>‹</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.periodBtn} onPress={() => setCalendarVisible(true)}>
                        <Text style={s.period}>{MONTH_NAMES[month - 1]} {year}</Text>
                        <Text style={s.calIcon}>📅</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.arrow} onPress={goToNext}>
                        <Text style={s.arrowText}>›</Text>
                    </TouchableOpacity>
                </View>

                <View style={s.tabRow}>
                    <TouchableOpacity
                        style={[s.tabBtn, tab === 'sales' && s.tabBtnActive]}
                        onPress={() => setTab('sales')}
                    >
                        <Text style={[s.tabText, tab === 'sales' && s.tabTextActive]}>
                            Ventas ({sales.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[s.tabBtn, tab === 'expenses' && s.tabBtnActive]}
                        onPress={() => setTab('expenses')}
                    >
                        <Text style={[s.tabText, tab === 'expenses' && s.tabTextActive]}>
                            Gastos ({expenses.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator color={theme.primary} style={s.spinner} />
                ) : tab === 'sales' ? (
                    sales.length === 0
                        ? <Text style={s.empty}>No hay ventas este mes.</Text>
                        : sales.map(renderSaleRow)
                ) : (
                    expenses.length === 0
                        ? <Text style={s.empty}>No hay gastos este mes.</Text>
                        : expenses.map(renderExpenseRow)
                )}
            </ScrollView>

            {/* ── View Sale Modal ── */}
            <Modal
                visible={viewSale !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setViewSale(null)}
            >
                <Pressable style={s.viewOverlay} onPress={() => setViewSale(null)}>
                    <Pressable style={s.viewCard} onPress={() => {}}>
                        <View style={s.modalHeader}>
                            <Text style={s.modalTitle}>Detalle de venta</Text>
                            <TouchableOpacity onPress={() => setViewSale(null)} hitSlop={HIT}>
                                <Text style={s.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        {viewSale && (
                            <>
                                <View style={s.detailRow}>
                                    <Text style={s.detailLabel}>Fecha</Text>
                                    <Text style={s.detailValue}>{formatDate(viewSale.saleDate)}</Text>
                                </View>
                                <View style={s.detailRow}>
                                    <Text style={s.detailLabel}>Tipo de cartón</Text>
                                    <Text style={s.detailValue}>{viewSale.cartonType} unidades</Text>
                                </View>
                                <View style={s.detailRow}>
                                    <Text style={s.detailLabel}>Cantidad</Text>
                                    <Text style={s.detailValue}>{viewSale.quantity} cartón(es)</Text>
                                </View>
                                <View style={s.detailRow}>
                                    <Text style={s.detailLabel}>Precio unitario</Text>
                                    <Text style={s.detailValue}>{formatColones(viewSale.pricePerCarton)}</Text>
                                </View>
                                <View style={[s.detailRow, s.detailDivider]}>
                                    <Text style={[s.detailLabel, { fontWeight: '700' }]}>Total</Text>
                                    <Text style={[s.detailValue, { color: theme.positive, fontWeight: '700' }]}>
                                        {formatColones(viewSale.totalAmount)}
                                    </Text>
                                </View>
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>

            {/* ── View Expense Modal ── */}
            <Modal
                visible={viewExpense !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setViewExpense(null)}
            >
                <Pressable style={s.viewOverlay} onPress={() => setViewExpense(null)}>
                    <Pressable style={s.viewCard} onPress={() => {}}>
                        <View style={s.modalHeader}>
                            <Text style={s.modalTitle}>Detalle de gasto</Text>
                            <TouchableOpacity onPress={() => setViewExpense(null)} hitSlop={HIT}>
                                <Text style={s.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        {viewExpense && (
                            <>
                                <View style={s.detailRow}>
                                    <Text style={s.detailLabel}>Fecha</Text>
                                    <Text style={s.detailValue}>{formatDate(viewExpense.expenseDate)}</Text>
                                </View>
                                <View style={s.detailRow}>
                                    <Text style={s.detailLabel}>Categoría</Text>
                                    <Text style={s.detailValue}>{viewExpense.categoryName ?? 'Sin categoría'}</Text>
                                </View>
                                <View style={[s.detailRow, s.detailDivider]}>
                                    <Text style={[s.detailLabel, { fontWeight: '700' }]}>Monto</Text>
                                    <Text style={[s.detailValue, { color: theme.negative, fontWeight: '700' }]}>
                                        {formatColones(viewExpense.amount)}
                                    </Text>
                                </View>
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>

            {/* ── Edit Sale Modal ── */}
            <Modal
                visible={editSale !== null}
                transparent
                animationType="slide"
                onRequestClose={() => !editLoading && setEditSale(null)}
            >
                <View style={s.editOverlay}>
                    <View style={s.editCard}>
                        <View style={s.modalHeader}>
                            <Text style={s.modalTitle}>Editar venta</Text>
                            <TouchableOpacity
                                onPress={() => !editLoading && setEditSale(null)}
                                hitSlop={HIT}
                            >
                                <Text style={s.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={s.fieldLabel}>Tipo de cartón</Text>
                        <View style={s.typeSelector}>
                            <TouchableOpacity
                                style={[s.typeOpt, eCartonType === 15 && s.typeOptSelected]}
                                onPress={() => setECartonType(15)}
                            >
                                <Text style={[s.typeOptText, eCartonType === 15 && s.typeOptTextSelected]}>
                                    15 unidades
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[s.typeOpt, eCartonType === 30 && s.typeOptSelected]}
                                onPress={() => setECartonType(30)}
                            >
                                <Text style={[s.typeOptText, eCartonType === 30 && s.typeOptTextSelected]}>
                                    30 unidades
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={s.fieldLabel}>Cantidad de cartones</Text>
                        <TextInput
                            style={s.input}
                            keyboardType="numeric"
                            value={eQuantity}
                            onChangeText={setEQuantity}
                            placeholderTextColor={theme.textMuted}
                        />

                        <Text style={s.fieldLabel}>Precio por cartón (₡)</Text>
                        <TextInput
                            style={s.input}
                            keyboardType="numeric"
                            value={ePrice}
                            onChangeText={setEPrice}
                            placeholderTextColor={theme.textMuted}
                        />

                        {eTotal > 0 && (
                            <View style={s.totalCard}>
                                <Text style={s.totalLabel}>Total</Text>
                                <Text style={[s.totalValue, { color: theme.positive }]}>
                                    {formatColones(eTotal)}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={s.primaryBtn}
                            onPress={submitEditSale}
                            disabled={editLoading}
                        >
                            {editLoading
                                ? <ActivityIndicator color={theme.primaryText} />
                                : <Text style={s.primaryBtnText}>Guardar cambios</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ── Edit Expense Modal ── */}
            <Modal
                visible={editExpense !== null}
                transparent
                animationType="slide"
                onRequestClose={() => !editLoading && setEditExpense(null)}
            >
                <View style={s.editOverlay}>
                    <ScrollView
                        style={s.editCard}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={s.modalHeader}>
                            <Text style={s.modalTitle}>Editar gasto</Text>
                            <TouchableOpacity
                                onPress={() => !editLoading && setEditExpense(null)}
                                hitSlop={HIT}
                            >
                                <Text style={s.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={s.fieldLabel}>Categoría</Text>
                        <TouchableOpacity
                            style={s.dropdownBtn}
                            onPress={() => setECatPickerVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={[s.dropdownTxt, eSelectedId === null && s.dropdownPlaceholder]}>
                                {editSelectedLabel}
                            </Text>
                            <Text style={s.dropdownArrow}>▾</Text>
                        </TouchableOpacity>

                        {eSelectedId === OTHER_ID && (
                            <>
                                <Text style={s.fieldLabel}>Especificá el gasto</Text>
                                <TextInput
                                    style={s.input}
                                    value={eOtherText}
                                    onChangeText={setEOtherText}
                                    placeholderTextColor={theme.textMuted}
                                    placeholder="Tipo de gasto..."
                                />
                            </>
                        )}

                        <Text style={s.fieldLabel}>Monto (₡)</Text>
                        <TextInput
                            style={s.input}
                            keyboardType="numeric"
                            value={eAmount}
                            onChangeText={setEAmount}
                            placeholderTextColor={theme.textMuted}
                        />

                        <Text style={s.fieldLabel}>Fecha</Text>
                        <View style={s.datePicker}>
                            <TouchableOpacity
                                style={s.dateArrow}
                                onPress={() => setEDate(d => addDays(d, -1))}
                                activeOpacity={0.7}
                            >
                                <Text style={s.dateArrowText}>‹</Text>
                            </TouchableOpacity>
                            <Text style={s.dateLabel}>{formatDateFull(eDate)}</Text>
                            <TouchableOpacity
                                style={s.dateArrow}
                                onPress={() => !eIsToday && setEDate(d => addDays(d, 1))}
                                activeOpacity={eIsToday ? 1 : 0.7}
                            >
                                <Text style={[s.dateArrowText, eIsToday && s.dateArrowTextDisabled]}>›</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={s.primaryBtn}
                            onPress={submitEditExpense}
                            disabled={editLoading}
                        >
                            {editLoading
                                ? <ActivityIndicator color={theme.primaryText} />
                                : <Text style={s.primaryBtnText}>Guardar cambios</Text>
                            }
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>

            {/* ── Category Picker (expense edit) ── */}
            <Modal
                visible={eCatPickerVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setECatPickerVisible(false)}
            >
                <Pressable style={s.pickerOverlay} onPress={() => setECatPickerVisible(false)}>
                    <View style={s.pickerCard}>
                        <Text style={s.pickerTitle}>SELECCIONAR CATEGORÍA</Text>
                        {categories.map(c => (
                            <TouchableOpacity
                                key={c.id}
                                style={[s.pickerItem, eSelectedId === c.id && s.pickerItemSelected]}
                                onPress={() => { setESelectedId(c.id); setECatPickerVisible(false); }}
                            >
                                <Text style={[s.pickerItemText, eSelectedId === c.id && s.pickerItemTextSelected]}>
                                    {c.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[s.pickerItem, eSelectedId === OTHER_ID && s.pickerItemSelected]}
                            onPress={() => { setESelectedId(OTHER_ID); setECatPickerVisible(false); }}
                        >
                            <Text style={[s.pickerItemText, eSelectedId === OTHER_ID && s.pickerItemTextSelected]}>
                                Otro
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            <MonthPickerModal
                visible={calendarVisible}
                month={month}
                year={year}
                onSelect={(m, y) => { setMonth(m); setYear(y); setCalendarVisible(false); }}
                onClose={() => setCalendarVisible(false)}
            />

            {FeedbackUI}
        </View>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 16, paddingBottom: 32 },

    picker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    arrow: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: theme.surface,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: theme.border,
    },
    arrowText: { fontSize: 28, color: theme.textPrimary, lineHeight: 32 },
    periodBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    period: { fontSize: 18, fontWeight: '600', color: theme.textPrimary },
    calIcon: { fontSize: 16 },

    tabRow: {
        flexDirection: 'row',
        backgroundColor: theme.surface,
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: theme.border,
        marginBottom: 16,
        overflow: 'hidden',
    },
    tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
    tabBtnActive: { backgroundColor: theme.primary },
    tabText: { fontSize: 15, fontWeight: '500', color: theme.textMuted },
    tabTextActive: { color: theme.primaryText },

    spinner: { marginTop: 40 },
    empty: { textAlign: 'center', color: theme.textMuted, fontSize: 16, marginTop: 40 },

    row: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: theme.surface, borderRadius: 12,
        padding: 12, marginBottom: 10,
        borderWidth: 0.5, borderColor: theme.border,
    },
    rowMain: { flex: 1, marginRight: 6 },
    rowDate: { fontSize: 13, color: theme.textMuted, marginBottom: 2 },
    rowTitle: { fontSize: 15, color: theme.textPrimary, fontWeight: '500' },
    rowAmount: { fontSize: 15, fontWeight: '700', marginRight: 4 },
    rowActions: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { padding: 4 },
    iconText: { fontSize: 16 },

    viewOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center', padding: 24,
    },
    viewCard: {
        backgroundColor: theme.surface, borderRadius: 20,
        padding: 24, width: '100%',
        shadowColor: '#000', shadowOpacity: 0.2,
        shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6,
    },
    modalHeader: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 16,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
    modalClose: { fontSize: 18, color: theme.textMuted, fontWeight: '600' },

    detailRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: 10,
    },
    detailDivider: {
        borderTopWidth: 1, borderTopColor: theme.border, marginTop: 4, paddingTop: 14,
    },
    detailLabel: { fontSize: 15, color: theme.textMuted },
    detailValue: { fontSize: 15, color: theme.textPrimary },

    editOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
    },
    editCard: {
        backgroundColor: theme.surface,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32,
        maxHeight: '90%',
    },

    fieldLabel: { fontSize: 13, color: theme.textMuted, marginBottom: 6, marginTop: 4 },
    typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    typeOpt: {
        flex: 1, padding: 12, borderRadius: 10,
        borderWidth: 1.5, borderColor: theme.border,
        backgroundColor: theme.background, alignItems: 'center',
    },
    typeOptSelected: { borderColor: theme.primary },
    typeOptText: { fontSize: 14, fontWeight: '500', color: theme.textPrimary },
    typeOptTextSelected: { color: theme.primary },

    input: {
        backgroundColor: theme.background,
        borderWidth: 0.5, borderColor: theme.border, borderRadius: 10,
        padding: 12, fontSize: 16, color: theme.textPrimary, marginBottom: 12,
    },
    totalCard: {
        backgroundColor: theme.background, borderRadius: 10,
        padding: 12, marginBottom: 12,
        borderWidth: 0.5, borderColor: theme.border,
    },
    totalLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 2 },
    totalValue: { fontSize: 20, fontWeight: '600' },

    primaryBtn: {
        backgroundColor: theme.primary, borderRadius: 12,
        padding: 14, alignItems: 'center', marginTop: 4,
    },
    primaryBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: '600' },

    dropdownBtn: {
        backgroundColor: theme.background, borderWidth: 0.5, borderColor: theme.border,
        borderRadius: 10, padding: 12, marginBottom: 12,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    dropdownTxt: { fontSize: 16, color: theme.textPrimary, flex: 1 },
    dropdownPlaceholder: { color: theme.textMuted },
    dropdownArrow: { fontSize: 16, color: theme.textMuted, marginLeft: 8 },

    datePicker: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: theme.background,
        borderWidth: 0.5, borderColor: theme.border,
        borderRadius: 10, marginBottom: 14, overflow: 'hidden',
    },
    dateArrow: { paddingVertical: 12, paddingHorizontal: 14 },
    dateArrowText: { fontSize: 22, color: theme.primary, fontWeight: '700' },
    dateArrowTextDisabled: { color: theme.border },
    dateLabel: { flex: 1, textAlign: 'center', fontSize: 14, color: theme.textPrimary, fontWeight: '500' },

    pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    pickerCard: {
        backgroundColor: theme.surface,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingTop: 16, paddingBottom: 32, paddingHorizontal: 16,
    },
    pickerTitle: {
        fontSize: 12, fontWeight: '600', color: theme.textMuted,
        textAlign: 'center', marginBottom: 12, letterSpacing: 0.8,
    },
    pickerItem: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4 },
    pickerItemSelected: { backgroundColor: theme.primary },
    pickerItemText: { fontSize: 17, color: theme.textPrimary },
    pickerItemTextSelected: { color: theme.primaryText, fontWeight: '600' },
});
