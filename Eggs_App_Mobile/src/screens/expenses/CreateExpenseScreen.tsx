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

export default function CreateExpenseScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

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
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScreenHeader title="Registrar gasto" />

            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Expense name */}
                    <Text style={styles.label}>Nombre del gasto</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Alimento para gallinas"
                        placeholderTextColor="#888"
                        value={name}
                        onChangeText={setName}
                    />

                    {/* Amount in colones */}
                    <Text style={styles.label}>Monto (₡)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />

                    {/* Optional description */}
                    <Text style={styles.label}>
                        Descripción <Text style={styles.optional}>(opcional)</Text>
                    </Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Notas adicionales..."
                        placeholderTextColor="#888"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                    />

                    {/* Category skipped for now — coming in future sprint */}
                    <TouchableOpacity style={styles.skipRow}>
                        <Text style={styles.skipText}>Categoría — Sin categoría</Text>
                    </TouchableOpacity>

                    {/* Save button with confirmation */}
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.primaryButtonText}>Guardar gasto</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.secondaryButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </ScrollView>

                <HomeButton />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 20, paddingBottom: 100 },
    label: { fontSize: 13, color: '#888', marginBottom: 6, marginTop: 4 },
    optional: { fontSize: 11, color: '#bbb' },
    input: {
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#1a1a2e',
        marginBottom: 14,
    },
    textArea: { height: 90, textAlignVertical: 'top' },
    skipRow: {
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
    },
    skipText: { fontSize: 14, color: '#888' },
    primaryButton: {
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
    secondaryButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#ddd',
    },
    secondaryButtonText: { color: '#1a1a2e', fontSize: 16 },
});