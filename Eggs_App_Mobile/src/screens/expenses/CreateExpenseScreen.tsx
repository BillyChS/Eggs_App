import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { createExpense, getCategories, Category } from '../../services/expensesService';
import ScreenHeader from '../../components/ScreenHeader';
import { KeyboardAwareScreen } from '../../components/KeyboardAwareScreen';
import { useFeedback } from '../../hooks/useFeedback';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

const OTHER_ID = -1;

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const formatDate = (d: Date) =>
    `${DAY_NAMES[d.getDay()]} ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;

const today = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (d: Date, n: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + n);
    return copy;
};

export default function CreateExpenseScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { showError, showConfirm, showSuccess, FeedbackUI } = useFeedback();
    const s = makeStyles(theme);

    const [amount, setAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState<Date>(today());
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [otherText, setOtherText] = useState('');
    const [pickerVisible, setPickerVisible] = useState(false);

    useEffect(() => {
        getCategories().then(setCategories).catch(() => {});
    }, []);

    const isToday = expenseDate.toDateString() === today().toDateString();

    const selectedLabel =
        selectedId === OTHER_ID
            ? `Otro: ${otherText || '…'}`
            : selectedId !== null
            ? categories.find(c => c.id === selectedId)?.name ?? 'Seleccionar categoría'
            : 'Seleccionar categoría';

    const handleSave = () => {
        if (!amount || parseFloat(amount) <= 0) {
            showError('Ingresá un monto válido.');
            return;
        }
        if (selectedId === OTHER_ID && !otherText.trim()) {
            showError('El campo "Otro" no puede ir vacío.');
            return;
        }
        showConfirm(
            '¿Confirmar gasto?',
            `${selectedLabel}\nMonto: ₡${parseFloat(amount).toLocaleString('es-CR')}\nFecha: ${formatDate(expenseDate)}`,
            submitExpense
        );
    };

    const submitExpense = async () => {
        setLoading(true);
        try {
            await createExpense(
                parseFloat(amount),
                expenseDate,
                selectedId !== null && selectedId !== OTHER_ID ? selectedId : undefined,
                selectedId === OTHER_ID ? otherText.trim() : undefined
            );
            showSuccess('Gasto registrado correctamente.', () => {
                setAmount('');
                setSelectedId(null);
                setOtherText('');
                setExpenseDate(today());
            });
        } catch (error) {
            showError('No se pudo registrar el gasto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={s.container}>
            <ScreenHeader title="Registrar gasto" />

            <KeyboardAwareScreen
                contentContainerStyle={s.content}
                footer={
                    <>
                        <TouchableOpacity
                            style={s.primaryButton}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={theme.primaryText} />
                            ) : (
                                <Text style={s.primaryButtonText}>Guardar gasto</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={s.secondaryButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={s.secondaryButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </>
                }
            >
                <Text style={s.label}>Categoría</Text>
                <TouchableOpacity
                    style={s.dropdownButton}
                    onPress={() => setPickerVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={[s.dropdownText, selectedId === null && s.dropdownPlaceholder]}>
                        {selectedLabel}
                    </Text>
                    <Text style={s.dropdownArrow}>▾</Text>
                </TouchableOpacity>

                {selectedId === OTHER_ID && (
                    <TextInput
                        style={s.input}
                        placeholder="Especificá el tipo de gasto..."
                        placeholderTextColor={theme.textMuted}
                        value={otherText}
                        onChangeText={setOtherText}
                    />
                )}

                <Text style={s.label}>Monto (₡)</Text>
                <TextInput
                    style={s.input}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <Text style={s.label}>Fecha</Text>
                <View style={s.datePicker}>
                    <TouchableOpacity
                        style={s.dateArrow}
                        onPress={() => setExpenseDate(d => addDays(d, -1))}
                        activeOpacity={0.7}
                    >
                        <Text style={s.dateArrowText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={s.dateLabel}>{formatDate(expenseDate)}</Text>
                    <TouchableOpacity
                        style={s.dateArrow}
                        onPress={() => !isToday && setExpenseDate(d => addDays(d, 1))}
                        activeOpacity={isToday ? 1 : 0.7}
                    >
                        <Text style={[s.dateArrowText, isToday && s.dateArrowTextDisabled]}>›</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAwareScreen>

            <Modal
                visible={pickerVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setPickerVisible(false)}
            >
                <Pressable style={s.pickerOverlay} onPress={() => setPickerVisible(false)}>
                    <View style={s.pickerCard}>
                        <Text style={s.pickerTitle}>SELECCIONAR CATEGORÍA</Text>

                        {categories.map(c => (
                            <TouchableOpacity
                                key={c.id}
                                style={[s.pickerItem, selectedId === c.id && s.pickerItemSelected]}
                                onPress={() => { setSelectedId(c.id); setPickerVisible(false); }}
                            >
                                <Text style={[s.pickerItemText, selectedId === c.id && s.pickerItemTextSelected]}>
                                    {c.name}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={[s.pickerItem, selectedId === OTHER_ID && s.pickerItemSelected]}
                            onPress={() => { setSelectedId(OTHER_ID); setPickerVisible(false); }}
                        >
                            <Text style={[s.pickerItemText, selectedId === OTHER_ID && s.pickerItemTextSelected]}>
                                Otro
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {FeedbackUI}
        </View>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 20 },

    label: { fontSize: 13, color: theme.textMuted, marginBottom: 6, marginTop: 4 },
    input: {
        backgroundColor: theme.surface,
        borderWidth: 0.5,
        borderColor: theme.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: theme.textPrimary,
        marginBottom: 14,
    },
    dropdownButton: {
        backgroundColor: theme.surface,
        borderWidth: 0.5,
        borderColor: theme.border,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownText: { fontSize: 16, color: theme.textPrimary, flex: 1 },
    dropdownPlaceholder: { color: theme.textMuted },
    dropdownArrow: { fontSize: 16, color: theme.textMuted, marginLeft: 8 },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.surface,
        borderWidth: 0.5,
        borderColor: theme.border,
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
    },
    dateArrow:             { paddingVertical: 14, paddingHorizontal: 18 },
    dateArrowText:         { fontSize: 22, color: theme.primary, fontWeight: '700' },
    dateArrowTextDisabled: { color: theme.border },
    dateLabel: { flex: 1, textAlign: 'center', fontSize: 15, color: theme.textPrimary, fontWeight: '500' },
    primaryButton: {
        backgroundColor: theme.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 10,
        minHeight: 52,
        justifyContent: 'center',
    },
    primaryButtonText: { color: theme.primaryText, fontSize: 16, fontWeight: '500' },
    secondaryButton: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: theme.border,
        minHeight: 52,
        justifyContent: 'center',
    },
    secondaryButtonText: { color: theme.textPrimary, fontSize: 16 },
    pickerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    pickerCard: {
        backgroundColor: theme.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: 16,
    },
    pickerTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.textMuted,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.8,
    },
    pickerItem:             { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4 },
    pickerItemSelected:     { backgroundColor: theme.primary },
    pickerItemText:         { fontSize: 17, color: theme.textPrimary },
    pickerItemTextSelected: { color: theme.primaryText, fontWeight: '600' },
});
