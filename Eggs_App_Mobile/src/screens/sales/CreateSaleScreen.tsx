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
import { createSale } from '../../services/salesService';

export default function CreateSaleScreen({ navigation }: any) {
    const [cartonType, setCartonType] = useState<15 | 30>(15);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const total = (parseInt(quantity) || 0) * (parseFloat(price) || 0);

    const handleSave = () => {
        if (!quantity || !price) {
            Alert.alert('Error', 'Por favor completá todos los campos.');
            return;
        }
        Alert.alert(
            '¿Confirmar venta?',
            `${quantity} cartón(es) de ${cartonType} u. × ₡${price}\nTotal: ₡${total.toLocaleString('es-CR')}`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sí, guardar', onPress: submitSale },
            ]
        );
    };

    const submitSale = async () => {
        setLoading(true);
        try {
            await createSale(cartonType, parseInt(quantity), parseFloat(price));
            Alert.alert('¡Éxito!', 'Venta registrada correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Error', 'No se pudo registrar la venta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Registrar venta</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Tipo de cartón</Text>
                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[styles.typeOpt, cartonType === 15 && styles.typeOptSelected]}
                        onPress={() => setCartonType(15)}
                    >
                        <Text style={[styles.typeOptText, cartonType === 15 && styles.typeOptTextSelected]}>
                            15 unidades
                        </Text>
                        <Text style={styles.typeOptSub}>Cartón pequeño</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeOpt, cartonType === 30 && styles.typeOptSelected]}
                        onPress={() => setCartonType(30)}
                    >
                        <Text style={[styles.typeOptText, cartonType === 30 && styles.typeOptTextSelected]}>
                            30 unidades
                        </Text>
                        <Text style={styles.typeOptSub}>Cartón grande</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Cantidad de cartones</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                />

                <Text style={styles.label}>Precio por cartón (₡)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />

                {total > 0 && (
                    <View style={styles.totalCard}>
                        <Text style={styles.totalLabel}>Total a registrar</Text>
                        <Text style={styles.totalValue}>₡ {total.toLocaleString('es-CR')}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Guardar venta</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.secondaryButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        backgroundColor: '#1a1a2e',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    backText: { color: '#fff', fontSize: 14 },
    headerTitle: { color: '#fff', fontSize: 16, fontWeight: '500' },
    content: { padding: 16 },
    label: { fontSize: 13, color: '#888', marginBottom: 6, marginTop: 4 },
    typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    typeOpt: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    typeOptSelected: { borderColor: '#1a1a2e', backgroundColor: '#E6EAF5' },
    typeOptText: { fontSize: 14, fontWeight: '500', color: '#1a1a2e' },
    typeOptTextSelected: { color: '#1a1a2e' },
    typeOptSub: { fontSize: 11, color: '#888', marginTop: 2 },
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
    totalCard: {
        backgroundColor: '#EAF3DE',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        borderWidth: 0.5,
        borderColor: '#C0DD97',
    },
    totalLabel: { fontSize: 12, color: '#3B6D11', marginBottom: 4 },
    totalValue: { fontSize: 22, fontWeight: '500', color: '#0F6E56' },
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