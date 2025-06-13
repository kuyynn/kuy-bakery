import { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useOrders } from '@/contexts/OrderContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Order, CartItem } from '@/types';

export default function AdminOrderScreen() {
  const { orders, loading, fetchOrders, updateOrderStatus } = useOrders();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Logout Gagal', error.message);
    else router.replace('../../auth/login');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const renderStatusBadge = (status: Order['status']) => {
    const badgeStyle = [styles.badge, styles[status] as object];
    return <Text style={badgeStyle}>{status.toUpperCase()}</Text>;
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>#{item.id}</Text>
      <Text style={styles.customerName}>{item.customer.name}</Text>
      <Text style={styles.address}>{item.customer.address}</Text>

      <View style={styles.itemsContainer}>
        {item.items.map((item: CartItem, index) => (
          <Text key={index} style={styles.item}>
            • {item.product.name} x {item.quantity}
          </Text>
        ))}
      </View>

      <Text style={styles.total}>Total: Rp {item.total.toLocaleString()}</Text>
      <View style={styles.statusContainer}>{renderStatusBadge(item.status)}</View>

      <View style={styles.buttonGroup}>
        {item.status === 'pending' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus(item.id, 'preparing')}
          >
            <Text style={styles.buttonText}>Siapkan</Text>
          </TouchableOpacity>
        )}
        {item.status === 'preparing' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus(item.id, 'ready')}
          >
            <Text style={styles.buttonText}>Siap Kirim</Text>
          </TouchableOpacity>
        )}
        {item.status === 'ready' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus(item.id, 'delivered')}
          >
            <Text style={styles.buttonText}>Kirim</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading && !orders.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4850c" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Kuy Bakery</Text>
        <TouchableOpacity onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#6b4e34" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        renderItem={renderOrderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff8e1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff3e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0e0d6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d4850c',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#d4850c',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
    color: '#6b4e34',
  },
  address: {
    fontSize: 14,
    color: '#6b5b4f',
    marginBottom: 8,
  },
  itemsContainer: {
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    color: '#4e342e',
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: '#d4850c',
  },
  statusContainer: {
    marginTop: 8,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  pending: {
    backgroundColor: '#f39c12',
  },
  confirmed: {
    backgroundColor: '#28a745',
  },
  delivered: {
    backgroundColor: '#20c997',
  },
  preparing: {
    backgroundColor: '#3498db',
  },
  ready: {
    backgroundColor: '#6f42c1',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#d4850c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});