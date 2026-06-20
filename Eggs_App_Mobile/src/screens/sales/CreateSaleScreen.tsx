import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { createSale, PaymentStatus } from '../../services/salesService';
import ScreenHeader from '../../components/ScreenHeader';
import { useFeedback } from '../../hooks/useFeedback';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

export default function CreateSaleScreen({ navigation }: any) {
    const { theme } = useTheme();
    const { showError, showConfirm, showSuccess, FeedbackUI } = useFeedback();
    const [cartonType, setCartonType] = useState<15 | 30>(15);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(false);

    const total = (parseInt(quantity) || 0) * (parseFloat(price) || 0);
    const s = makeStyles(theme);

    const handleSave = () => {
        if (!quantity || !price) {
            showError('Por favor completá todos los campos.');
            return;
        }
        if (paymentStatus === 'Pending' && !customerName.trim()) {
            showError('Ingresá el nombre del cliente para la venta a crédito.');
            return;
        }

        const paymentLine =
            paymentStatus === 'Pending'
                ? `Queda pendiente — Cliente: ${customerName.trim()}`
                : 'Pago al contado';

        showConfirm(
            '¿Confirmar venta?',
            `${quantity} cartón(es) de ${cartonType} u. × ₡${price}\nTotal: ₡${total.toLocaleString('es-CR')}\n${paymentLine}`,
            submitSale
        );
    };

    const submitSale = async () => {
        setLoading(true);
        try {
            await createSale(
                cartonType,
                parseInt(quantity),
                parseFloat(price),
                paymentStatus,
                paymentStatus === 'Pending' ? customerName.trim() : undefined
            );
            showSuccess(
                paymentStatus === 'Paid'
                    ? 'Venta registrada correctamente.'
                    : `Venta a crédito registrada para ${customerName.trim()}.`,
                () => {
                    setQuantity('');
                    setPrice('');
                    setCartonType(15);
                    setPaymentStatus('Paid');
                    setCustomerName('');
                }
            );
        } catch {
            showError('No se pudo registrar la venta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={s.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScreenHeader title="Registrar venta" />

            <View style={{ flex: 1, backgroundColor: theme.background }}>
                <ScrollView
                    style={s.container}
                    contentContainerStyle={s.content}
                    keyboardShouldPersistTaps="handled"
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

                    {/* Payment status */}
                    <Text style={s.label}>¿El cliente ya pagó?</Text>
                    <View style={s.paymentSelector}>
                        <TouchableOpacity
                            style={[s.payOpt, paymentStatus === 'Paid' && s.payOptPaid]}
                            onPress={() => setPaymentStatus('Paid')}
                            activeOpacity={0.75}
                        >
                            <Text style={[s.payOptText, paymentStatus === 'Paid' && s.payOptTextPaid]}>
                                Sí, ya pagó
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[s.payOpt, paymentStatus === 'Pending' && s.payOptPending]}
                            onPress={() => setPaymentStatus('Pending')}
                            activeOpacity={0.75}
                        >
                            <Text style={[s.payOptText, paymentStatus === 'Pending' && s.payOptTextPending]}>
                                No, queda pendiente
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {paymentStatus === 'Pending' && (
                        <>
                            <Text style={s.label}>Nombre del cliente</Text>
                            <TextInput
                                style={s.input}
                                placeholder="¿Quién debe?"
                                placeholderTextColor={theme.textMuted}
                                value={customerName}
                                onChangeText={setCustomerName}
                                autoCapitalize="words"
                            />
                        </>
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

            {FeedbackUI}
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

    paymentSelector: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    payOpt: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    payOptPaid: { borderColor: theme.positive, backgroundColor: theme.surface },
    payOptPending: { borderColor: theme.warning, backgroundColor: theme.surface },
    payOptText: { fontSize: 15, fontWeight: '600', color: theme.textMuted, textAlign: 'center' },
    payOptTextPaid: { color: theme.positive },
    payOptTextPending: { color: theme.warning },

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
