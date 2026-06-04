import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

interface Props {
    title: string;
    showBack?: boolean;   // false on Home (no need to go back)
}

export default function ScreenHeader({ title, showBack = true }: Props) {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
    };

    return (
        <>
            {/* Navy title bar with ☰ menu toggle — same on every screen */}
            <View style={[styles.navbar, { paddingTop: insets.top + 12 }]}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setMenuOpen(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
            </View>

            {/* Dropdown menu (tap outside to close) */}
            <Modal
                visible={menuOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuOpen(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
                    <View style={[styles.menuCard, { top: insets.top + 56 }]}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                            <Text style={styles.menuItemText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* Light-blue "Volver" button below the navy bar (hidden on Home) */}
            {showBack && (
                <View style={styles.backRow}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backText}>‹ Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#1a1a2e',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 14,
        paddingHorizontal: 16,
    },
    title: { color: '#fff', fontSize: 20, fontWeight: '600', flex: 1 },
    menuButton: { paddingHorizontal: 8, paddingVertical: 4 },
    menuIcon: { color: '#fff', fontSize: 28 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
    menuCard: {
        position: 'absolute',
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 6,
        minWidth: 190,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    menuItem: { paddingVertical: 14, paddingHorizontal: 18 },
    menuItemText: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
    backRow: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    backButton: {
        backgroundColor: '#AED6F1',   // light blue
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 22,
        alignSelf: 'flex-start',
    },
    backText: { color: '#1a1a2e', fontSize: 18, fontWeight: '700' },
});