import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { register } from '../../services/authService';
import { useTheme } from '../../theme/ThemeContext';
import { Theme } from '../../theme/colors';

export default function RegisterScreen() {
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const s = makeStyles(theme);

    const handleRegister = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Por favor completá todos los campos.');
            return;
        }
        setLoading(true);
        try {
            await register(username, password);
            Alert.alert('Éxito', 'Usuario registrado correctamente.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo registrar el usuario.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={s.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={s.inner}>
                <Text style={s.title}>Crear cuenta</Text>

                <TextInput
                    style={s.input}
                    placeholder="Usuario"
                    placeholderTextColor={theme.textMuted}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={s.input}
                    placeholder="Contraseña"
                    placeholderTextColor={theme.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={s.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.primaryText} />
                    ) : (
                        <Text style={s.buttonText}>Registrarse</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    inner: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    title: {
        fontSize: 28,
        fontWeight: '500',
        textAlign: 'center',
        color: theme.textPrimary,
        marginBottom: 32,
    },
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
    button: {
        backgroundColor: theme.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: { color: theme.primaryText, fontSize: 16, fontWeight: '500' },
});
