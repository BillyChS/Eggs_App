import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';

export default function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <ScreenHeader title="🥚 Eggs App" showBack={false} />

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

                {/* Navigate to create expense screen */}
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('CreateExpense')}
                >
                    <Text style={styles.secondaryButtonText}>− Registrar gasto</Text>
                </TouchableOpacity>

                {/* Navigate to summary screen */}
                <TouchableOpacity
                    style={styles.summaryButton}
                    onPress={() => navigation.navigate('Summary')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.summaryIcon}>📊</Text>
                    <Text style={styles.summaryButtonText}>Ver resumen mensual</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
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
    summaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e8449',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginVertical: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    summaryIcon: { fontSize: 24, marginRight: 12 },
    summaryButtonText: { fontSize: 20, fontWeight: '700', color: '#fff' },
});