import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/colors';

const MONTH_ABBR = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const ROWS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]];

interface Props {
    visible: boolean;
    month: number;
    year: number;
    onSelect: (month: number, year: number) => void;
    onClose: () => void;
}

export default function MonthPickerModal({ visible, month, year, onSelect, onClose }: Props) {
    const { theme } = useTheme();
    const s = makeStyles(theme);
    const [pickerYear, setPickerYear] = useState(year);

    useEffect(() => {
        if (visible) setPickerYear(year);
    }, [visible, year]);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={s.overlay} onPress={onClose}>
                <Pressable style={s.card} onPress={() => {}}>
                    <View style={s.header}>
                        <TouchableOpacity
                            onPress={() => setPickerYear(y => y - 1)}
                            style={s.yearArrow}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Text style={s.yearArrowText}>‹</Text>
                        </TouchableOpacity>
                        <Text style={s.yearLabel}>{pickerYear}</Text>
                        <TouchableOpacity
                            onPress={() => setPickerYear(y => y + 1)}
                            style={s.yearArrow}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Text style={s.yearArrowText}>›</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            style={s.closeBtn}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Text style={s.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {ROWS.map((row, ri) => (
                        <View key={ri} style={s.row}>
                            {row.map(mi => {
                                const isSelected = (mi + 1) === month && pickerYear === year;
                                return (
                                    <TouchableOpacity
                                        key={mi}
                                        style={[s.monthBtn, isSelected && s.monthBtnSelected]}
                                        onPress={() => onSelect(mi + 1, pickerYear)}
                                    >
                                        <Text style={[s.monthText, isSelected && s.monthTextSelected]}>
                                            {MONTH_ABBR[mi]}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    card: {
        backgroundColor: theme.surface,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    yearArrow: { padding: 8 },
    yearArrowText: { fontSize: 30, color: theme.primary, fontWeight: '700' },
    yearLabel: { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '700', color: theme.textPrimary },
    closeBtn: { padding: 8 },
    closeText: { fontSize: 24, color: theme.textMuted, fontWeight: '600' },
    row: { flexDirection: 'row', marginBottom: 10 },
    monthBtn: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: theme.background,
    },
    monthBtnSelected: { backgroundColor: theme.primary },
    monthText: { fontSize: 17, fontWeight: '600', color: theme.textPrimary },
    monthTextSelected: { color: theme.primaryText, fontWeight: '700' },
});
