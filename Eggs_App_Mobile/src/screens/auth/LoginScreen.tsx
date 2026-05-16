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
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Por favor ingresá tu usuario y contraseña.');
            return;
        }
        setLoading(true);
        try {
            await login(username, password);
        } catch (error) {
            Alert.alert('Error', 'Usuario o contraseña incorrectos.');
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
                <Text style={styles.logo}>🥚</Text>
                <Text style={styles.title}>Eggs App</Text>
                <Text style={styles.subtitle}>Control del negocio</Text>

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
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Ingresar</Text>
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
    logo: { fontSize: 64, textAlign: 'center', marginBottom: 8 },
    title: {
        fontSize: 28,
        fontWeight: '500',
        textAlign: 'center',
        color: '#1a1a2e',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
        marginBottom: 40,
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