import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import HomeScreen from '../screens/home/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import CreateSaleScreen from '../screens/sales/CreateSaleScreen';
import CreateExpenseScreen from '../screens/expenses/CreateExpenseScreen';
import SummaryScreen from '../screens/reports/SummaryScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import ReceivablesScreen from '../screens/receivables/ReceivablesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { token, isLoading } = useAuth();
    const { isDark, theme } = useTheme();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {token ? (
                        <>
                            <Stack.Screen name="Home" component={HomeScreen} />
                            <Stack.Screen name="CreateSale" component={CreateSaleScreen} />
                            <Stack.Screen name="CreateExpense" component={CreateExpenseScreen} />
                            <Stack.Screen name="Summary" component={SummaryScreen} />
                            <Stack.Screen name="History" component={HistoryScreen} />
                            <Stack.Screen name="Receivables" component={ReceivablesScreen} />
                        </>
                    ) : (
                        <Stack.Screen name="Login" component={LoginScreen} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
