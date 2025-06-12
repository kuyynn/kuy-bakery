import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react-native';
import { CartItem } from '@/components/CartItem';
import { useCart } from '@/contexts/CartContext';
import { router } from 'expo-router';

export default function CartScreen() {
    const { items, getTotalPrice, getTotalItems, clearCart } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        }).format(price);
    };

    const handleCheckout = () => {
        if (items.length === 0) {
        Alert.alert('Keranjang Kosong', 'Silakan tambahkan produk ke keranjang terlebih dahulu.');
        return;
        }
        router.push('/checkout');
    };

    const handleClearCart = () => {
        Alert.alert(
        'Kosongkan Keranjang',
        'Apakah Anda yakin ingin menghapus semua item dari keranjang?',
        [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: clearCart },
        ]
        );
    };

    if (items.length === 0) {
        return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
            <Text style={styles.title}>Keranjang Belanja</Text>
            </View>
            <View style={styles.emptyContainer}>
            <ShoppingBag size={80} color="#d4850c" />
            <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
            <Text style={styles.emptyText}>
                Belum ada produk di keranjang Anda.{'\n'}Yuk, mulai berbelanja sekarang!
            </Text>
            <TouchableOpacity 
                style={styles.shopButton}
                onPress={() => router.push('/(tabs)')}
            >
                <Text style={styles.shopButtonText}>Mulai Belanja</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <View style={styles.headerContent}>
            <View>
                <Text style={styles.title}>Keranjang Belanja</Text>
                <Text style={styles.itemCount}>{getTotalItems()} item</Text>
            </View>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
                <Trash2 size={20} color="#e74c3c" />
            </TouchableOpacity>
            </View>
        </View>

        <ScrollView style={styles.itemList} showsVerticalScrollIndicator={false}>
            {items.map(item => (
            <CartItem key={item.product.id} item={item} />
            ))}
            
            <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Ringkasan Pesanan</Text>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({getTotalItems()} item)</Text>
                <Text style={styles.summaryValue}>{formatPrice(getTotalPrice())}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Biaya Pengiriman</Text>
                <Text style={styles.summaryValue}>Gratis</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>{formatPrice(getTotalPrice())}</Text>
            </View>
            </View>
        </ScrollView>

        <View style={styles.footer}>
            <View style={styles.totalContainer}>
            <Text style={styles.footerTotalLabel}>Total Pembayaran:</Text>
            <Text style={styles.footerTotalPrice}>{formatPrice(getTotalPrice())}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Lanjut ke Pembayaran</Text>
            <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#d4850c',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    itemCount: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        marginTop: 2,
    },
    clearButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        padding: 8,
    },
    itemList: {
        flex: 1,
        padding: 20,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c1810',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6b5b4f',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2c1810',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c1810',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#d4850c',
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
        marginBottom: 32,
    },
    shopButton: {
        backgroundColor: '#d4850c',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    shopButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e1e1e1',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    footerTotalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c1810',
    },
    footerTotalPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#d4850c',
    },
    checkoutButton: {
        backgroundColor: '#d4850c',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    checkoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});