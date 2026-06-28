import React from 'react';
import {
    ScrollView,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

interface KeyboardAwareScreenProps {
    children: React.ReactNode;
    /**
     * Action buttons rendered in a fixed footer pinned to the bottom.
     * The footer does not react to the keyboard — it stays in place while
     * the user types, which is the intended behaviour for short forms.
     */
    footer?: React.ReactNode;
    /** Extra styles merged into the ScrollView contentContainerStyle. */
    contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * Shell for forms with a pinned footer.
 *
 * No keyboard listeners or dynamic padding — the keyboard simply overlaps the
 * footer while typing. This prevents the scroll range from growing artificially
 * and keeps the footer anchored to the bottom at all times.
 */
export function KeyboardAwareScreen({
    children,
    footer,
    contentContainerStyle,
}: KeyboardAwareScreenProps) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    return (
        <View style={styles.flex}>
            <ScrollView
                style={styles.flex}
                contentContainerStyle={[styles.content, contentContainerStyle]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
            >
                {children}
            </ScrollView>

            {footer ? (
                <View
                    style={[
                        styles.footer,
                        {
                            borderTopColor: theme.border,
                            paddingBottom: insets.bottom + 12,
                        },
                    ]}
                >
                    {footer}
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    content: { flexGrow: 1, paddingBottom: 24 },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});
