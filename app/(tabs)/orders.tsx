import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClipboardList, Clock, CircleCheck as CheckCircle, Truck, Package } from 'lucide-react-native';
import { useOrders } from '@/contexts/OrderContext';

export default function OrdersScreen() {
    const { orders } = useOrders();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        }).format(date);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
        case 'pending':
            return <Clock size={20} color="#f39c12" />;
        case 'confirmed':
            return <CheckCircle size={20} color="#27ae60" />;
        case 'preparing':
            return <Package size={20} color="#3498db" />;
        case 'ready':
            return <Truck size={20} color="#2ecc71" />;
        case 'delivered':
            return <CheckCircle size={20} color="#27ae60" />;
        default:
            return <Clock size={20} color="#95a5a6" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
        case 'pending':
            return 'Menunggu Konfirmasi';
        case 'confirmed':
            return 'Dikonfirmasi';
        case 'preparing':
            return 'Sedang Diproses';
        case 'ready':
            return 'Siap Diambil';
        case 'delivered':
            return 'Selesai';
        default:
            return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
        case 'pending':
            return '#f39c12';
        case 'confirmed':
            return '#27ae60';
        case 'preparing':
            return '#3498db';
        case 'ready':
            return '#2ecc71';
        case 'delivered':
            return '#27ae60';
        default:
            return '#95a5a6';
        }
    };

    if (orders.length === 0) {
        return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
            <Text style={styles.title}>Riwayat Pesanan</Text>
            </View>
            <View style={styles.emptyContainer}>
            <ClipboardList size={80} color="#d4850c" />
            <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>
            <Text style={styles.emptyText}>
                Pesanan Anda akan muncul di sini{'\n'}setelah melakukan pembelian
            </Text>
            </View>
        </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Riwayat Pesanan</Text>
            <Text style={styles.orderCount}>{orders.length} pesanan</Text>
        </View>

        <ScrollView style={styles.orderList} showsVerticalScrollIndicator={false}>
            {orders.map(order => (
            <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{order.id}</Text>
                <View style={[styles.statusContainer, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
                    {getStatusIcon(order.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {getStatusText(order.status)}
                    </Text>
                </View>
                </View>
                
                <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                
                <View style={styles.orderItems}>
                <Text style={styles.itemsTitle}>Item pesanan:</Text>
                {order.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemText}>
                        {item.quantity}x {item.product.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                        {formatPrice(item.product.price * item.quantity)}
                    </Text>
                    </View>
                ))}
                </View>
                
                <View style={styles.orderFooter}>
                <View>
                    <Text style={styles.customerLabel}>Pemesan:</Text>
                    <Text style={styles.customerName}>{order.customer.name}</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
                </View>
                </View>
            </View>
            ))}
        </ScrollView>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        backgroundColor: '#d4850c',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    orderCount: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
    },
    orderList: {
        flex: 1,
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c1810',
        marginTop: 20,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#6b5b4f',
        textAlign: 'center',
        lineHeight: 24,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2c1810',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    orderDate: {
        fontSize: 14,
        color: '#6b5b4f',
        marginBottom: 16,
    },
    orderItems: {
        marginBottom: 16,
    },
    itemsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c1810',
        marginBottom: 8,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemText: {
        fontSize: 14,
        color: '#6b5b4f',
        flex: 1,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2c1810',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    customerLabel: {
        fontSize: 12,
        color: '#6b5b4f',
    },
    customerName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2c1810',
        marginTop: 2,
    },
    totalContainer: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 12,
        color: '#6b5b4f',
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: '700',
        color: '#d4850c',
        marginTop: 2,
    },
});