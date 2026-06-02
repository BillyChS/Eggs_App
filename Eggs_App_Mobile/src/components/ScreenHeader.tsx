import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    title: string;
}

// Reusable navy top bar with a large "Volver" button. Same on every inner screen.
export default function ScreenHeader({ title }: Props) {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <Text style={styles.backText}>‹ Volver</Text>
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <View style={styles.spacer} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1a1a2e',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 14,
    },
    backButton: {
        backgroundColor: '#AED6F1',   // light blue
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 22,
    },
    backText: { color: '#1a1a2e', fontSize: 18, fontWeight: '700' },
    title: { color: '#fff', fontSize: 20, fontWeight: '600', flex: 1, textAlign: 'center' },
    spacer: { width: 92 },   // matches back button width to keep the title centered
});