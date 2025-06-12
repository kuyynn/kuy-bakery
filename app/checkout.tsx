import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MapPin, User, Phone, Chrome as Home, ArrowLeft, CreditCard } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { CustomerInfo } from '@/types';
import MapView, { Marker } from 'react-native-maps';

export default function CheckoutScreen() {
    const { items, getTotalPrice, clearCart } = useCart();
    const { addOrder } = useOrders();
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '',
        phone: '',
        address: '',
    });
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getCurrentLocation = async () => {
        if (Platform.OS === 'web') {
            Alert.alert(
                'Fitur GPS',
                'Fitur GPS tidak tersedia di versi web. Silakan masukkan alamat secara manual.',
                [{ text: 'OK' }]
            );
            return;
        }

        setIsGettingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Izin Lokasi Diperlukan',
                    'Aplikasi memerlukan izin akses lokasi untuk menentukan alamat pengiriman.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            const addressData = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (addressData.length > 0) {
                const address = addressData[0];
                const fullAddress = `${address.street || ''} ${address.city || ''} ${address.region || ''}`.trim();
                
                setCustomerInfo(prev => ({
                    ...prev,
                    address: fullAddress || `${latitude}, ${longitude}`,
                    coordinates: { latitude, longitude },
                }));
            } else {
                setCustomerInfo(prev => ({
                    ...prev,
                    coordinates: { latitude, longitude },
                }));
            }
        } catch (error) {
            Alert.alert('Error', 'Gagal mendapatkan lokasi. Silakan coba lagi atau masukkan alamat secara manual.');
        } finally {
            setIsGettingLocation(false);
        }
    };

    const handleSubmitOrder = async () => {
        if (!customerInfo.name.trim()) {
            Alert.alert('Error', 'Silakan masukkan nama Anda');
            return;
        }
        if (!customerInfo.phone.trim()) {
            Alert.alert('Error', 'Silakan masukkan nomor telepon');
            return;
        }
        if (!customerInfo.address.trim()) {
            Alert.alert('Error', 'Silakan masukkan alamat pengiriman');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderId = await addOrder(items, customerInfo);
            clearCart();

            // Show success alert first, then navigate immediately
            Alert.alert(
                'Pesanan Berhasil!',
                `Terima kasih ${customerInfo.name}! Pesanan Anda telah diterima dengan ID: ${orderId}.`,
                [
                    { text: 'OK' }
                ]
            );
            router.replace('/(tabs)/orders');
        } catch (error) {
            Alert.alert('Error', 'Gagal membuat pesanan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Checkout</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 Ringkasan Pesanan</Text>
                    <View style={styles.orderSummary}>
                        {items.map(item => (
                            <View key={item.product.id} style={styles.orderItem}>
                                <Text style={styles.itemName}>{item.product.name}</Text>
                                <Text style={styles.itemDetails}>
                                    {item.quantity}x {formatPrice(item.product.price)}
                                </Text>
                                <Text style={styles.itemTotal}>
                                    {formatPrice(item.product.price * item.quantity)}
                                </Text>
                            </View>
                        ))}
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Pembayaran:</Text>
                            <Text style={styles.totalPrice}>{formatPrice(getTotalPrice())}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👤 Informasi Pelanggan</Text>
                    
                    <View style={styles.inputGroup}>
                        <View style={styles.inputIcon}>
                            <User size={20} color="#d4850c" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Nama lengkap"
                            value={customerInfo.name}
                            onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, name: text }))}
                            placeholderTextColor="#6b5b4f"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputIcon}>
                            <Phone size={20} color="#d4850c" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Nomor telepon (contoh: 0812-3456-7890)"
                            value={customerInfo.phone}
                            onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, phone: text }))}
                            keyboardType="phone-pad"
                            placeholderTextColor="#6b5b4f"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputIcon}>
                            <Home size={20} color="#d4850c" />
                        </View>
                        <TextInput
                            style={[styles.input, styles.addressInput]}
                            placeholder="Alamat lengkap untuk pengiriman"
                            value={customerInfo.address}
                            onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, address: text }))}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                            placeholderTextColor="#6b5b4f"
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.locationButton} 
                        onPress={getCurrentLocation}
                        disabled={isGettingLocation}
                    >
                        <MapPin size={20} color="#d4850c" />
                        <Text style={styles.locationButtonText}>
                            {isGettingLocation ? 'Mendapatkan Lokasi...' : 'Gunakan Lokasi Saat Ini'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💳 Metode Pembayaran</Text>
                    <View style={styles.paymentMethod}>
                        <CreditCard size={24} color="#d4850c" />
                        <View style={styles.paymentInfo}>
                            <Text style={styles.paymentTitle}>Bayar di Tempat (COD)</Text>
                            <Text style={styles.paymentSubtitle}>Pembayaran tunai saat pesanan diterima</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerTotal}>
                    <Text style={styles.footerTotalLabel}>Total Pembayaran:</Text>
                    <Text style={styles.footerTotalPrice}>{formatPrice(getTotalPrice())}</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmitOrder}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? 'Memproses Pesanan...' : 'Buat Pesanan'}
                    </Text>
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
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c1810',
        marginBottom: 16,
    },
    orderSummary: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#2c1810',
    },
    itemDetails: {
        fontSize: 14,
        color: '#6b5b4f',
        marginHorizontal: 12,
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '600',
        color: '#d4850c',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        marginTop: 8,
        borderTopWidth: 2,
        borderTopColor: '#d4850c',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2c1810',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#d4850c',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e1e1e1',
    },
    inputIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2c1810',
    },
    addressInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff3e0',
        borderWidth: 2,
        borderColor: '#d4850c',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 8,
    },
    locationButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#d4850c',
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: '#d4850c',
    },
    paymentInfo: {
        marginLeft: 16,
        flex: 1,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c1810',
        marginBottom: 4,
    },
    paymentSubtitle: {
        fontSize: 14,
        color: '#6b5b4f',
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
    footerTotal: {
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
    submitButton: {
        backgroundColor: '#d4850c',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#bca084',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

