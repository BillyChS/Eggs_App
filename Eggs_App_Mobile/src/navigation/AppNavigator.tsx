import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/home/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import CreateSaleScreen from '../screens/sales/CreateSaleScreen';

// Stack navigator instance with typed routes
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    // Get token and loading state from auth context
    const { token, isLoading } = useAuth();

    // Show spinner while token is being loaded from AsyncStorage
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1a1a2e" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {token ? (
                    // Authenticated screens — only accessible with valid token
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="CreateSale" component={CreateSaleScreen} />
                    </>
                ) : (
                    // Public screens — accessible without token
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}