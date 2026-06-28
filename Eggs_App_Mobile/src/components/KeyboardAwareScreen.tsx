import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleProp,
    StyleSheet,
    TextInput,
    View,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

export interface KeyboardAwareScreenHandle {
    scrollFocusedIntoView: () => void;
}

interface KeyboardAwareScreenProps {
    children: React.ReactNode;
    /**
     * Action buttons rendered in a fixed footer anchored to the bottom of the screen.
     * The footer does not move when the keyboard opens — it stays at the bottom and
     * is hidden behind the keyboard while typing.
     */
    footer?: React.ReactNode;
    /** Extra styles merged into the ScrollView contentContainerStyle. */
    contentContainerStyle?: StyleProp<ViewStyle>;
    /** Height of any fixed header above this component (passed to keyboardVerticalOffset). */
    headerOffset?: number;
    /** Extra gap (px) between the focused field bottom and the keyboard edge (default 16). */
    extraScrollGap?: number;
}

export const KeyboardAwareScreen = forwardRef<KeyboardAwareScreenHandle, KeyboardAwareScreenProps>(
    function KeyboardAwareScreen(
        { children, footer, contentContainerStyle, headerOffset = 0, extraScrollGap = 16 },
        ref,
    ) {
        const insets = useSafeAreaInsets();
        const { theme } = useTheme();

        const scrollRef = useRef<ScrollView>(null);
        // Tracks current scroll offset so we can calculate relative scrollTo targets.
        const scrollOffsetRef = useRef(0);
        // Updated by keyboard show/hide listeners; used in overlap calculation.
        const keyboardHeightRef = useRef(0);
        // Footer height in state so the ScrollView bottom padding re-renders when it changes.
        const [footerHeight, setFooterHeight] = useState(0);

        /**
         * Scrolls the currently focused TextInput above the keyboard edge.
         * The footer is fixed behind the keyboard, so only keyboard height matters here.
         * Safe to call when the keyboard is already open (field-to-field navigation).
         */
        const scrollFocusedIntoView = useCallback(() => {
            const input = TextInput.State.currentlyFocusedInput();
            if (!input) return;

            input.measureInWindow((_x, y, _w, height) => {
                const screenHeight = Dimensions.get('window').height;
                // Obstacle is only the keyboard — the footer sits behind it.
                const obstacle = screenHeight - keyboardHeightRef.current;
                const fieldBottom = y + height;
                const overlap = fieldBottom - obstacle;
                if (overlap > 0) {
                    scrollRef.current?.scrollTo({
                        y: scrollOffsetRef.current + overlap + extraScrollGap,
                        animated: true,
                    });
                }
            });
        }, [extraScrollGap]);

        useImperativeHandle(ref, () => ({ scrollFocusedIntoView }), [scrollFocusedIntoView]);

        useEffect(() => {
            const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
                keyboardHeightRef.current = e.endCoordinates.height;
                scrollFocusedIntoView();
            });
            const hideSub = Keyboard.addListener('keyboardDidHide', () => {
                keyboardHeightRef.current = 0;
            });
            return () => {
                showSub.remove();
                hideSub.remove();
            };
        }, [scrollFocusedIntoView]);

        return (
            <View style={styles.flex}>
                {/* KeyboardAvoidingView contains only the ScrollView so it shrinks when the
                    keyboard opens without pulling the footer up with it. */}
                <KeyboardAvoidingView
                    style={styles.flex}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={headerOffset}
                >
                    <ScrollView
                        ref={scrollRef}
                        style={styles.flex}
                        contentContainerStyle={[
                            styles.content,
                            contentContainerStyle,
                            // Reserve space at the bottom so the last item is never hidden
                            // behind the absolute footer when the keyboard is closed.
                            { paddingBottom: footer ? footerHeight + 24 : 24 },
                        ]}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        overScrollMode="never"
                        scrollEventThrottle={16}
                        onScroll={(e) => {
                            scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
                        }}
                    >
                        {children}
                    </ScrollView>
                </KeyboardAvoidingView>

                {footer ? (
                    <View
                        style={[
                            styles.footer,
                            {
                                borderTopColor: theme.border,
                                // Opaque background so scroll content doesn't show through.
                                backgroundColor: theme.background,
                                paddingBottom: insets.bottom + 12,
                            },
                        ]}
                        onLayout={(e) => {
                            setFooterHeight(e.nativeEvent.layout.height);
                        }}
                    >
                        {footer}
                    </View>
                ) : null}
            </View>
        );
    },
);

const styles = StyleSheet.create({
    flex: { flex: 1 },
    content: { flexGrow: 1 },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 20,
        paddingTop: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});
