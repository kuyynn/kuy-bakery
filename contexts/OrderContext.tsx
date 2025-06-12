import { createContext, useContext, useState, ReactNode } from 'react';
import { Order, CartItem, CustomerInfo } from '@/types';
import { supabase } from '@/lib/supabase';
import * as Location from 'expo-location';

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], customer: CustomerInfo) => Promise<string>;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const getCurrentCoordinates = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Izin lokasi ditolak');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const addOrder = async (
    items: CartItem[],
    customer: CustomerInfo
  ): Promise<string> => {
    const orderId = `ORD-${Date.now()}`;
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Ambil lokasi jika tidak tersedia
    let { latitude, longitude } = customer;
    if (latitude == null || longitude == null) {
      const location = await getCurrentCoordinates();
      if (location) {
        latitude = location.latitude;
        longitude = location.longitude;
      }
    }

    const newOrder: Order = {
      id: orderId,
      items,
      customer: {
        ...customer,
        latitude,
        longitude,
      },
      total,
      status: 'pending',
      createdAt: new Date(),
    };

    // Simpan ke Supabase
    const { error } = await supabase.from('orders').insert([
      {
        id: newOrder.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        latitude,
        longitude,
        total_price: total,
        status: newOrder.status,
        created_at: newOrder.createdAt.toISOString(),
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          total_price: item.product.price * item.quantity,
        })),
      },
    ]);

    if (error) {
      console.error('Gagal menyimpan order ke Supabase:', error.message);
    }

    setOrders((prevOrders) => [newOrder, ...prevOrders]);

    setTimeout(() => {
      updateOrderStatus(orderId, 'confirmed');
    }, 2000);

    return orderId;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, getOrderById, updateOrderStatus }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
