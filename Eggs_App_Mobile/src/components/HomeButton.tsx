import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Reusable "home" button — always returns to the Home screen.
export default function HomeButton() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    return (
        // Full-width wrapper centers the button; box-none lets touches pass through the empty area.
        <View
            style={[styles.wrapper, { bottom: insets.bottom + 16 }]}
            pointerEvents="box-none"
        >
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Home')}
                activeOpacity={0.85}
            >
                <Text style={styles.text}>🏠  Inicio</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    button: {
        backgroundColor: '#1a1a2e',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    text: { fontSize: 18, fontWeight: '700', color: '#fff' },
});