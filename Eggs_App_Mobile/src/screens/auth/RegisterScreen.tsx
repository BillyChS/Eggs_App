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

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.inner}>
                <Text style={styles.title}>Crear cuenta</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Usuario"
                    placeholderTextColor="#888"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Registrarse</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    inner: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    title: {
        fontSize: 28,
        fontWeight: '500',
        textAlign: 'center',
        color: '#1a1a2e',
        marginBottom: 32,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#1a1a2e',
        marginBottom: 14,
    },
    button: {
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});