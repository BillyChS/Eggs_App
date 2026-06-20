import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type TagVariant = 'Paid' | 'Pending';

interface Props {
    variant: TagVariant;
}

export default function Tag({ variant }: Props) {
    const { theme, isDark } = useTheme();

    const config =
        variant === 'Paid'
            ? {
                  bg: isDark ? 'rgba(74, 222, 128, 0.18)' : '#DCFCE7',
                  color: isDark ? '#4ADE80' : '#166534',
                  label: 'Pagado',
              }
            : {
                  bg: isDark ? 'rgba(251, 191, 36, 0.18)' : '#FEF3C7',
                  color: isDark ? '#FBBF24' : '#92400E',
                  label: 'Pendiente',
              };

    return (
        <View style={[s.pill, { backgroundColor: config.bg }]}>
            <Text style={[s.label, { color: config.color }]}>{config.label}</Text>
        </View>
    );
}

const s = StyleSheet.create({
    pill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    label: { fontSize: 13, fontWeight: '600' },
});
