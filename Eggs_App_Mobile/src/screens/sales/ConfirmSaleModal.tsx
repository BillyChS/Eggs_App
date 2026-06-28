import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { PaymentStatus } from '../../services/salesService';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

interface Props {
    visible: boolean;
    cartonType: 15 | 30;
    quantity: number;
    price: number;
    total: number;
    onConfirm: (paymentStatus: PaymentStatus, customerName?: string) => void;
    onCancel: () => void;
}

export default function ConfirmSaleModal({
    visible, cartonType, quantity, price, total, onConfirm, onCancel,
}: Props) {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
    const [customerName, setCustomerName] = useState('');
    const [nameError, setNameError] = useState(false);

    // Reset internal state each time the modal opens so it starts fresh.
    useEffect(() => {
        if (visible) {
            setPaymentStatus('Paid');
            setCustomerName('');
            setNameError(false);
        }
    }, [visible]);

    const handleConfirm = () => {
        if (paymentStatus === 'Pending' && !customerName.trim()) {
            setNameError(true);
            return;
        }
        onConfirm(
            paymentStatus,
            paymentStatus === 'Pending' ? customerName.trim() : undefined,
        );
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            {/*
             * KeyboardAvoidingView wraps the full overlay so the card shifts up
             * when the optional customer-name input triggers the keyboard.
             * behavior="padding" works for iOS; "height" shrinks the overlay on Android.
             */}
            <KeyboardAvoidingView
                style={s.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Pressable style={s.overlay} onPress={onCancel}>
                    {/* Inner Pressable stops tap-through so the card doesn't close on its own taps */}
                    <Pressable style={s.card}>

                        <Text style={s.title}>Confirmar venta</Text>

                        {/* Sale summary */}
                        <View style={s.summaryCard}>
                            <Text style={s.summaryLine}>
                                {quantity} cartón(es) de {cartonType} u. × ₡{price.toLocaleString('es-CR')}
                            </Text>
                            <Text style={s.summaryTotal}>
                                ₡ {total.toLocaleString('es-CR')}
                            </Text>
                        </View>

                        {/* Payment question */}
                        <Text style={s.label}>¿El cliente ya pagó?</Text>
                        <View style={s.paymentSelector}>
                            <TouchableOpacity
                                style={[s.payOpt, paymentStatus === 'Paid' && s.payOptPaid]}
                                onPress={() => { setPaymentStatus('Paid'); setNameError(false); }}
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

                        {/* Conditional customer name — only when payment is pending */}
                        {paymentStatus === 'Pending' && (
                            <>
                                <Text style={s.label}>Nombre del cliente</Text>
                                <TextInput
                                    style={[s.input, nameError && s.inputError]}
                                    placeholder="¿Quién debe?"
                                    placeholderTextColor={theme.textMuted}
                                    value={customerName}
                                    onChangeText={(v) => {
                                        setCustomerName(v);
                                        if (nameError) setNameError(false);
                                    }}
                                    autoCapitalize="words"
                                />
                                {nameError && (
                                    <Text style={s.errorText}>Ingresá el nombre del cliente.</Text>
                                )}
                            </>
                        )}

                        {/* Action buttons */}
                        <View style={s.buttons}>
                            <TouchableOpacity style={[s.btn, s.btnSecondary]} onPress={onCancel}>
                                <Text style={s.btnSecondaryText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={handleConfirm}>
                                <Text style={s.btnPrimaryText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>

                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    flex: { flex: 1 },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: theme.surface,
        borderRadius: 22,
        padding: 24,
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.textPrimary,
        textAlign: 'center',
        marginBottom: 16,
    },

    summaryCard: {
        backgroundColor: theme.background,
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        borderWidth: 0.5,
        borderColor: theme.border,
    },
    summaryLine: { fontSize: 15, color: theme.textMuted, marginBottom: 6 },
    summaryTotal: { fontSize: 24, fontWeight: '600', color: theme.positive },

    label: { fontSize: 13, color: theme.textMuted, marginBottom: 8 },

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
    payOptPaid:    { borderColor: theme.positive },
    payOptPending: { borderColor: theme.warning },
    payOptText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textMuted,
        textAlign: 'center',
    },
    payOptTextPaid:    { color: theme.positive },
    payOptTextPending: { color: theme.warning },

    input: {
        backgroundColor: theme.background,
        borderWidth: 0.5,
        borderColor: theme.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: theme.textPrimary,
        marginBottom: 4,
    },
    inputError: { borderColor: theme.negative, borderWidth: 1 },
    errorText: { fontSize: 13, color: theme.negative, marginBottom: 8 },

    buttons: { flexDirection: 'row', gap: 12, marginTop: 20 },
    btn: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    btnPrimary:   { backgroundColor: theme.primary },
    btnSecondary: { backgroundColor: theme.surface, borderWidth: 1.5, borderColor: theme.border },
    btnPrimaryText:   { fontSize: 16, fontWeight: '700', color: '#fff' },
    btnSecondaryText: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
});
