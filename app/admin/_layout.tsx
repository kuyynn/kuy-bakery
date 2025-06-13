import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff3e0',
          borderTopColor: '#e0cfc0',
          height: 60,
        },
        tabBarActiveTintColor: '#d4850c',
        tabBarInactiveTintColor: '#a78d74',
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="produk"
        options={{
          title: 'Produk',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="bread-slice" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="users" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}