import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { createExpense } from '../../services/expensesService';
import HomeButton from '../../components/HomeButton';
import ScreenHeader from '../../components/ScreenHeader';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

export default function CreateExpenseScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const s = makeStyles(theme);

    // Handle save with confirmation dialog
    const handleSave = () => {
        if (!name || !amount) {
            Alert.alert('Error', 'Por favor completá el nombre y el monto.');
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

    // Submit expense to the API
    const submitExpense = async () => {
        setLoading(true);
        try {
            await createExpense(
                name,
                parseFloat(amount),
                description || undefined,
                undefined // Category is optional — skipped for now
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

                    {/* Category skipped for now — coming in future sprint */}
                    <TouchableOpacity style={s.skipRow}>
                        <Text style={s.skipText}>Categoría — Sin categoría</Text>
                    </TouchableOpacity>

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

                <HomeButton />
            </View>
        </KeyboardAvoidingView>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 20, paddingBottom: 100 },
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
    skipRow: {
        backgroundColor: theme.surface,
        borderWidth: 0.5,
        borderColor: theme.border,
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
    },
    skipText: { fontSize: 14, color: theme.textMuted },
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
});
