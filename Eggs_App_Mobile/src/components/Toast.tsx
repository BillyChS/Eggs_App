import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/colors';

interface Props {
    visible: boolean;
    message: string;
    onDismiss: () => void;
}

export default function Toast({ visible, message, onDismiss }: Props) {
    const { theme } = useTheme();
    const s = makeStyles(theme);
    const opacity = useRef(new Animated.Value(0)).current;
    // Keep the latest callback in a ref to avoid stale closures
    const onDismissRef = useRef(onDismiss);
    useEffect(() => { onDismissRef.current = onDismiss; });

    useEffect(() => {
        if (!visible) return;
        opacity.setValue(0);
        Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
            Animated.delay(2200),
            Animated.timing(opacity, { toValue: 0, duration: 320, useNativeDriver: true }),
        ]).start(({ finished }) => {
            if (finished) onDismissRef.current();
        });
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[s.toast, { opacity }]}>
            <View style={s.iconCircle}>
                <Text style={s.icon}>✓</Text>
            </View>
            <Text style={s.message}>{message}</Text>
        </Animated.View>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    toast: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        backgroundColor: theme.positive,
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    icon:    { fontSize: 22, color: '#fff', fontWeight: '700' },
    message: { fontSize: 18, color: '#fff', fontWeight: '600', flex: 1, lineHeight: 24 },
});
