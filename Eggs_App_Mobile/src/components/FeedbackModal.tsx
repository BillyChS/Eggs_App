import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/colors';

export type FeedbackType = 'error' | 'warning' | 'confirm';

interface Props {
    visible: boolean;
    type: FeedbackType;
    title: string;
    message: string;
    onDismiss: () => void;
    onConfirm: () => void;
}

const CONFIG: Record<FeedbackType, { icon: string; label: string }> = {
    error:   { icon: '✕', label: 'Entendido' },
    warning: { icon: '!', label: 'Entendido' },
    confirm: { icon: '?', label: 'Confirmar' },
};

export default function FeedbackModal({ visible, type, title, message, onDismiss, onConfirm }: Props) {
    const { theme } = useTheme();
    const s = makeStyles(theme);
    const cfg = CONFIG[type];

    const accentColor =
        type === 'error'   ? theme.negative :
        type === 'warning' ? theme.warning  :
        theme.primary;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
            <Pressable
                style={s.overlay}
                onPress={type !== 'confirm' ? onDismiss : undefined}
            >
                {/* Stop tap propagation so card doesn't close on inner tap */}
                <Pressable style={s.card}>
                    <View style={[s.iconCircle, { backgroundColor: accentColor }]}>
                        <Text style={s.iconText}>{cfg.icon}</Text>
                    </View>

                    <Text style={s.title}>{title}</Text>
                    <Text style={s.message}>{message}</Text>

                    <View style={s.buttons}>
                        {type === 'confirm' && (
                            <TouchableOpacity style={[s.btn, s.btnSecondary]} onPress={onDismiss}>
                                <Text style={s.btnSecondaryText}>Cancelar</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[s.btn, { backgroundColor: accentColor }]}
                            onPress={type === 'confirm' ? onConfirm : onDismiss}
                        >
                            <Text style={s.btnPrimaryText}>{cfg.label}</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 28,
    },
    card: {
        backgroundColor: theme.surface,
        borderRadius: 22,
        padding: 28,
        width: '100%',
        alignItems: 'center',
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
    },
    iconText: { fontSize: 28, color: '#fff', fontWeight: '700' },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.textPrimary,
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 17,
        color: theme.textMuted,
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 26,
    },
    buttons: { flexDirection: 'row', gap: 12, width: '100%' },
    btn: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    btnSecondary: {
        backgroundColor: theme.surface,
        borderWidth: 1.5,
        borderColor: theme.border,
    },
    btnSecondaryText: { fontSize: 17, fontWeight: '600', color: theme.textPrimary },
    btnPrimaryText:   { fontSize: 17, fontWeight: '700', color: '#fff' },
});
