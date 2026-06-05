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
import ScreenHeader from '../../components/ScreenHeader';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

export default function CreateSaleScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [cartonType, setCartonType] = useState<15 | 30>(15);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const total = (parseInt(quantity) || 0) * (parseFloat(price) || 0);
    const s = makeStyles(theme);

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
            style={s.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScreenHeader title="Registrar venta" />

            <View style={{ flex: 1, backgroundColor: theme.background }}>
                <ScrollView
                    style={s.container}
                    contentContainerStyle={s.content}
                >
                    <Text style={s.label}>Tipo de cartón</Text>
                    <View style={s.typeSelector}>
                        <TouchableOpacity
                            style={[s.typeOpt, cartonType === 15 && s.typeOptSelected]}
                            onPress={() => setCartonType(15)}
                        >
                            <Text style={[s.typeOptText, cartonType === 15 && s.typeOptTextSelected]}>
                                15 unidades
                            </Text>
                            <Text style={s.typeOptSub}>Cartón pequeño</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[s.typeOpt, cartonType === 30 && s.typeOptSelected]}
                            onPress={() => setCartonType(30)}
                        >
                            <Text style={[s.typeOptText, cartonType === 30 && s.typeOptTextSelected]}>
                                30 unidades
                            </Text>
                            <Text style={s.typeOptSub}>Cartón grande</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={s.label}>Cantidad de cartones</Text>
                    <TextInput
                        style={s.input}
                        placeholder="0"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                    />

                    <Text style={s.label}>Precio por cartón (₡)</Text>
                    <TextInput
                        style={s.input}
                        placeholder="0"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                    />

                    {total > 0 && (
                        <View style={s.totalCard}>
                            <Text style={s.totalLabel}>Total a registrar</Text>
                            <Text style={s.totalValue}>₡ {total.toLocaleString('es-CR')}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={s.primaryButton}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={theme.primaryText} />
                        ) : (
                            <Text style={s.primaryButtonText}>Guardar venta</Text>
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
        </KeyboardAvoidingView>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 20, paddingBottom: 32 },
    label: { fontSize: 13, color: theme.textMuted, marginBottom: 6, marginTop: 4 },
    typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    typeOpt: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        alignItems: 'center',
    },
    typeOptSelected: { borderColor: theme.primary, backgroundColor: theme.surface },
    typeOptText: { fontSize: 14, fontWeight: '500', color: theme.textPrimary },
    typeOptTextSelected: { color: theme.primary },
    typeOptSub: { fontSize: 11, color: theme.textMuted, marginTop: 2 },
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
    totalCard: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        borderWidth: 0.5,
        borderColor: theme.border,
    },
    totalLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 4 },
    totalValue: { fontSize: 22, fontWeight: '500', color: theme.positive },
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
