import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/colors';

export default function HomeButton() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const s = makeStyles(theme);

    return (
        <View
            style={[s.wrapper, { bottom: insets.bottom + 16 }]}
            pointerEvents="box-none"
        >
            <TouchableOpacity
                style={s.button}
                onPress={() => navigation.navigate('Home')}
                activeOpacity={0.85}
            >
                <Text style={s.text}>🏠  Inicio</Text>
            </TouchableOpacity>
        </View>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    button: {
        backgroundColor: theme.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    text: { fontSize: 18, fontWeight: '700', color: theme.primaryText },
});
