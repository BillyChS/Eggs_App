import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { createSale, PaymentStatus } from '../../services/salesService';
import ScreenHeader from '../../components/ScreenHeader';
import { KeyboardAwareScreen, KeyboardAwareScreenHandle } from '../../components/KeyboardAwareScreen';
import { useFeedback } from '../../hooks/useFeedback';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';
import ConfirmSaleModal from './ConfirmSaleModal';

export default function CreateSaleScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { showError, showSuccess, FeedbackUI } = useFeedback();
    const kbAwareRef = useRef<KeyboardAwareScreenHandle>(null);
    const [cartonType, setCartonType] = useState<15 | 30>(15);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const total = (parseInt(quantity) || 0) * (parseFloat(price) || 0);
    const s = makeStyles(theme);

    const handleSave = () => {
        if (!quantity || !price) {
            showError('Por favor completá todos los campos.');
            return;
        }
        setConfirmVisible(true);
    };

    // Called by the modal once the user selects payment method and taps "Confirmar".
    const handleConfirm = (paymentStatus: PaymentStatus, customerName?: string) => {
        setConfirmVisible(false);
        submitSale(paymentStatus, customerName);
    };

    const submitSale = async (paymentStatus: PaymentStatus, customerName?: string) => {
        setLoading(true);
        try {
            await createSale(
                cartonType,
                parseInt(quantity),
                parseFloat(price),
                paymentStatus,
                customerName,
            );
            showSuccess(
                paymentStatus === 'Paid'
                    ? 'Venta registrada correctamente.'
                    : `Venta a crédito registrada para ${customerName}.`,
                () => {
                    setQuantity('');
                    setPrice('');
                    setCartonType(15);
                }
            );
        } catch {
            showError('No se pudo registrar la venta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={s.container}>
            <ScreenHeader title="Registrar venta" />

            <KeyboardAwareScreen
                ref={kbAwareRef}
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
                                <Text style={s.primaryButtonText}>Guardar venta</Text>
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
                    onFocus={() => kbAwareRef.current?.scrollFocusedIntoView()}
                />

                <Text style={s.label}>Precio por cartón (₡)</Text>
                <TextInput
                    style={s.input}
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                    onFocus={() => kbAwareRef.current?.scrollFocusedIntoView()}
                />

                {total > 0 && (
                    <View style={s.totalCard}>
                        <Text style={s.totalLabel}>Total a registrar</Text>
                        <Text style={s.totalValue}>₡ {total.toLocaleString('es-CR')}</Text>
                    </View>
                )}
            </KeyboardAwareScreen>

            <ConfirmSaleModal
                visible={confirmVisible}
                cartonType={cartonType}
                quantity={parseInt(quantity) || 0}
                price={parseFloat(price) || 0}
                total={total}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmVisible(false)}
            />

            {FeedbackUI}
        </View>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 20 },

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
    typeOptSelected: { borderColor: theme.primary },
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
});
