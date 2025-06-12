import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { CartProvider } from '@/contexts/CartContext';
import { OrderProvider } from '@/contexts/OrderContext';

export default function RootLayout() {
    useFrameworkReady();

    return (
        <CartProvider>
        <OrderProvider>
            <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </OrderProvider>
        </CartProvider>
    );
}