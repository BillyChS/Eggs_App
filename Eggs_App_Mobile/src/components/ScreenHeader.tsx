import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/colors';

interface Props {
    title: string;
    showBack?: boolean;
}

export default function ScreenHeader({ title, showBack = true }: Props) {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { logout } = useAuth();
    const { theme, isDark, setMode } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const s = makeStyles(theme);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
    };

    return (
        <>
            {/* Navy title bar with ☰ menu toggle — same on every screen */}
            <View style={[s.navbar, { paddingTop: insets.top + 12 }]}>
                <Text style={s.title} numberOfLines={1}>{title}</Text>
                <TouchableOpacity
                    style={s.menuButton}
                    onPress={() => setMenuOpen(true)}
                    activeOpacity={0.7}
                >
                    <Text style={s.menuIcon}>☰</Text>
                </TouchableOpacity>
            </View>

            {/* Dropdown menu (tap outside to close) */}
            <Modal
                visible={menuOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuOpen(false)}
            >
                <Pressable style={s.overlay} onPress={() => setMenuOpen(false)}>
                    <View style={[s.menuCard, { top: insets.top + 56 }]}>
                        {/* Dark mode toggle */}
                        <View style={s.menuItem}>
                            <Text style={s.menuItemText}>{isDark ? '🌙' : '☀️'} {isDark ? 'Modo oscuro' : 'Modo claro'}</Text>
                            <Switch
                                value={isDark}
                                onValueChange={(v) => setMode(v ? 'dark' : 'light')}
                                trackColor={{ false: theme.border, true: theme.primary }}
                                thumbColor={theme.surface}
                            />
                        </View>
                        {showBack && (
                            <>
                                <View style={s.menuDivider} />
                                <TouchableOpacity
                                    style={s.menuItem}
                                    onPress={() => { setMenuOpen(false); navigation.navigate('Home'); }}
                                >
                                    <Text style={s.menuItemText}>🏠 Inicio</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <View style={s.menuDivider} />
                        <TouchableOpacity style={s.menuItem} onPress={handleLogout}>
                            <Text style={s.menuItemText}>🚪 Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* "Volver" button below the navbar (hidden on Home) */}
            {showBack && (
                <View style={s.backRow}>
                    <TouchableOpacity
                        style={s.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Text style={s.backText}>‹ Volver</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    navbar: {
        backgroundColor: theme.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 14,
        paddingHorizontal: 16,
    },
    title: { color: theme.primaryText, fontSize: 20, fontWeight: '600', flex: 1 },
    menuButton: { paddingHorizontal: 8, paddingVertical: 4 },
    menuIcon: { color: theme.primaryText, fontSize: 28 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
    menuCard: {
        position: 'absolute',
        right: 16,
        backgroundColor: theme.surface,
        borderRadius: 12,
        paddingVertical: 6,
        minWidth: 220,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 18,
    },
    menuItemText: { fontSize: 18, fontWeight: '600', color: theme.textPrimary },
    menuDivider: { height: 1, backgroundColor: theme.border, marginHorizontal: 12 },
    backRow: {
        backgroundColor: theme.background,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    backButton: {
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    backText: { color: theme.textPrimary, fontSize: 18, fontWeight: '700' },
});
