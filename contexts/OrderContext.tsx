import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order, CartItem, CustomerInfo } from '@/types';
import { supabase } from '@/lib/supabase';
import * as Location from 'expo-location';

// Helper untuk menampilkan pesan error yang aman
const getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : String(error);
};

interface OrderContextType {
    orders: Order[];
    loading: boolean;
    addOrder: (items: CartItem[], customer: CustomerInfo) => Promise<string>;
    getOrderById: (orderId: string) => Order | undefined;
    fetchOrders: () => Promise<void>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            const formattedOrders: Order[] = data.map((order) => ({
                id: order.id,
                items: order.items.map((item: any) => ({
                    product: {
                        id: item.product_id,
                        name: item.product_name,
                        price: item.price,
                    },
                    quantity: item.quantity,
                })),
                customer: {
                    name: order.name,
                    phone: order.phone,
                    address: order.address,
                    latitude: order.latitude,
                    longitude: order.longitude,
                },
                total: order.total_price,
                status: order.status,
                createdAt: new Date(order.created_at),
            }));

            setOrders(formattedOrders);
        } catch (error) {
            console.error('Error fetching orders:', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

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
        setLoading(true);
        const orderId = `ORD-${Date.now()}`;
        const total = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

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

        try {
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
                throw error;
            }

            setOrders((prevOrders) => [newOrder, ...prevOrders]);
            return orderId;
        } catch (error) {
            console.error('Gagal menyimpan order ke Supabase:', getErrorMessage(error));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getOrderById = (orderId: string) => {
        return orders.find((order) => order.id === orderId);
    };

    const updateOrderStatus = async (orderId: string, status: Order['status']) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', orderId);

            if (error) {
                throw error;
            }

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status } : order
                )
            );
        } catch (error) {
            console.error('Gagal mengupdate status order:', getErrorMessage(error));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                loading,
                addOrder,
                getOrderById,
                fetchOrders,
                updateOrderStatus,
            }}
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
