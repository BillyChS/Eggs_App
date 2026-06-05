import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { createExpense, getCategories, Category } from '../../services/expensesService';
import ScreenHeader from '../../components/ScreenHeader';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

const OTHER_ID = -1; // Sentinel value for the "Otro" option

export default function CreateExpenseScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null); // null = nothing chosen yet
    const [otherText, setOtherText] = useState('');
    const [pickerVisible, setPickerVisible] = useState(false);

    const s = makeStyles(theme);

    useEffect(() => {
        getCategories().then(setCategories).catch(() => {});
    }, []);

    const selectedLabel =
        selectedId === OTHER_ID
            ? `Otro: ${otherText || '…'}`
            : selectedId !== null
            ? categories.find(c => c.id === selectedId)?.name ?? 'Seleccionar categoría'
            : 'Seleccionar categoría';

    const handleSave = () => {
        if (!name || !amount) {
            Alert.alert('Error', 'Por favor completá el nombre y el monto.');
            return;
        }
        if (selectedId === OTHER_ID && !otherText.trim()) {
            Alert.alert('Error', 'Especificá el tipo de gasto en el campo "Otro".');
            return;
        }
        Alert.alert(
            '¿Confirmar gasto?',
            `${name}\nMonto: ₡${parseFloat(amount).toLocaleString('es-CR')}`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sí, guardar', onPress: submitExpense },
            ]
        );
    };

    const submitExpense = async () => {
        setLoading(true);
        try {
            await createExpense(
                name,
                parseFloat(amount),
                description || undefined,
                selectedId !== null && selectedId !== OTHER_ID ? selectedId : undefined,
                selectedId === OTHER_ID ? otherText.trim() : undefined
            );
            Alert.alert('¡Éxito!', 'Gasto registrado correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Error', 'No se pudo registrar el gasto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={s.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScreenHeader title="Registrar gasto" />

            <View style={{ flex: 1, backgroundColor: theme.background }}>
                <ScrollView contentContainerStyle={s.content}>
                    {/* Expense name */}
                    <Text style={s.label}>Nombre del gasto</Text>
                    <TextInput
                        style={s.input}
                        placeholder="Ej: Alimento para gallinas"
                        placeholderTextColor={theme.textMuted}
                        value={name}
                        onChangeText={setName}
                    />

                    {/* Amount in colones */}
                    <Text style={s.label}>Monto (₡)</Text>
                    <TextInput
                        style={s.input}
                        placeholder="0"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />

                    {/* Category dropdown */}
                    <Text style={s.label}>
                        Categoría <Text style={s.optional}>(opcional)</Text>
                    </Text>
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

                    {/* Free-text field shown only when "Otro" is selected */}
                    {selectedId === OTHER_ID && (
                        <TextInput
                            style={s.input}
                            placeholder="Especificá el tipo de gasto..."
                            placeholderTextColor={theme.textMuted}
                            value={otherText}
                            onChangeText={setOtherText}
                        />
                    )}

                    {/* Optional description */}
                    <Text style={s.label}>
                        Descripción <Text style={s.optional}>(opcional)</Text>
                    </Text>
                    <TextInput
                        style={[s.input, s.textArea]}
                        placeholder="Notas adicionales..."
                        placeholderTextColor={theme.textMuted}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                    />

                    {/* Save button with confirmation */}
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
                </ScrollView>
            </View>

            {/* Category picker modal */}
            <Modal
                visible={pickerVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setPickerVisible(false)}
            >
                <Pressable style={s.pickerOverlay} onPress={() => setPickerVisible(false)}>
                    <View style={s.pickerCard}>
                        <Text style={s.pickerTitle}>Seleccionar categoría</Text>

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
        </KeyboardAvoidingView>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 20, paddingBottom: 32 },
    label: { fontSize: 13, color: theme.textMuted, marginBottom: 6, marginTop: 4 },
    optional: { fontSize: 11, color: theme.textMuted },
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
    textArea: { height: 90, textAlignVertical: 'top' },
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
    },
    secondaryButtonText: { color: theme.textPrimary, fontSize: 16 },
    // Picker modal
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
        fontSize: 14,
        fontWeight: '600',
        color: theme.textMuted,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    pickerItem: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 4,
    },
    pickerItemSelected: { backgroundColor: theme.primary },
    pickerItemText: { fontSize: 17, color: theme.textPrimary },
    pickerItemTextSelected: { color: theme.primaryText, fontWeight: '600' },
});
