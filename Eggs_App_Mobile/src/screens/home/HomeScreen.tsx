import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

// Props from the stack navigator
export default function HomeScreen({ navigation }: any) {
    // Get logout function from auth context
    const { logout } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            {/* Top navigation bar */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🥚 Eggs App</Text>
                <TouchableOpacity onPress={logout}>
                    <Text style={styles.logoutText}>Salir</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Current month label */}
                <Text style={styles.monthLabel}>Mayo 2026</Text>

                {/* Main profit card */}
                <View style={styles.mainCard}>
                    <Text style={styles.mainCardLabel}>Ganancia del mes</Text>
                    <Text style={styles.mainCardValue}>₡ 0</Text>
                    <Text style={styles.mainCardSub}>Sin registros aún</Text>
                </View>

                {/* Sales and expenses summary cards */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Ventas</Text>
                        <Text style={[styles.statValue, { color: '#0F6E56' }]}>₡ 0</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Gastos</Text>
                        <Text style={[styles.statValue, { color: '#A32D2D' }]}>₡ 0</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>ACCIONES RÁPIDAS</Text>

                {/* Navigate to create sale screen */}
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('CreateSale')}
                >
                    <Text style={styles.primaryButtonText}>+ Registrar venta</Text>
                </TouchableOpacity>

                {/* Navigate to create expense screen — coming soon */}
                <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>− Registrar gasto</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        backgroundColor: '#1a1a2e',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '500' },
    logoutText: { color: '#fff', fontSize: 14 },
    content: { padding: 16 },
    monthLabel: {
        fontSize: 14,
        color: '#1a1a2e',
        fontWeight: '500',
        marginBottom: 14,
    },
    mainCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 0.5,
        borderColor: '#ddd',
    },
    mainCardLabel: { fontSize: 13, color: '#888', marginBottom: 4 },
    mainCardValue: { fontSize: 28, fontWeight: '500', color: '#0F6E56' },
    mainCardSub: { fontSize: 12, color: '#888', marginTop: 2 },
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 14,
        borderWidth: 0.5,
        borderColor: '#ddd',
    },
    statLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: '500' },
    sectionTitle: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    primaryButton: {
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
    secondaryButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#ddd',
        marginBottom: 10,
    },
    secondaryButtonText: { color: '#1a1a2e', fontSize: 16 },
});