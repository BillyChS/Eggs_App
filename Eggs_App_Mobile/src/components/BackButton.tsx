import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Reusable "back" button — goes to the previous screen.
export default function BackButton() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    return (
        <TouchableOpacity
            style={[styles.button, { top: insets.top + 8 }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
        >
            <Text style={styles.text}>‹ Atrás</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        left: 16,
        backgroundColor: '#AED6F1',   // light blue
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 24,
        zIndex: 10,
    },
    text: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
});