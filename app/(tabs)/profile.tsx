import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Phone, MapPin, Info, Clock, Star, Award } from 'lucide-react-native';

export default function ProfileScreen() {
    const handleContactPress = () => {
        Alert.alert(
        'Hubungi Kami',
        'Telepon: (021) 123-4567\nWhatsApp: 0812-3456-7890\nEmail: info@tokirotisegar.com\n\nJam Operasional:\nSenin - Minggu: 06:00 - 22:00 WIB',
        [{ text: 'OK' }]
        );
    };

    const handleAboutPress = () => {
        Alert.alert(
        'Tentang Kami',
        'Toko Roti Segar adalah toko roti dan kue terpercaya yang telah melayani pelanggan selama lebih dari 10 tahun. Kami menggunakan bahan-bahan berkualitas tinggi dan resep tradisional untuk menghadirkan produk terbaik.\n\nKomitmen kami:\n• Bahan berkualitas premium\n• Proses higienis dan halal\n• Pelayanan terbaik\n• Harga terjangkau',
        [{ text: 'OK' }]
        );
    };

    const handleLocationPress = () => {
        Alert.alert(
        'Lokasi Toko',
        'Alamat Lengkap:\nJl. Raya Bakti No. 123\nJakarta Selatan 12345\n\nJam Operasional:\nSenin - Minggu\n06:00 - 22:00 WIB\n\nFasilitas:\n• Parkir luas\n• WiFi gratis\n• Area duduk nyaman',
        [{ text: 'OK' }]
        );
    };

    const handleHoursPress = () => {
        Alert.alert(
        'Jam Operasional',
        'Senin - Minggu: 06:00 - 22:00 WIB\n\nKami buka setiap hari untuk melayani Anda!\n\nProduk fresh tersedia:\n• Roti: 06:00 - 21:00\n• Kue: 08:00 - 20:00\n• Pre-order: 24 jam sebelumnya',
        [{ text: 'OK' }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Profil Toko</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.storeInfo}>
            <View style={styles.storeHeader}>
                <View style={styles.storeLogo}>
                <Text style={styles.storeLogoText}>TR</Text>
                </View>
                <View style={styles.storeDetails}>
                <Text style={styles.storeName}>Kuy Bakery</Text>
                <Text style={styles.storeTagline}>Roti dan Kue Berkualitas Premium</Text>
                <View style={styles.ratingContainer}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.rating}>4.8</Text>
                    <Text style={styles.reviews}>(1,247 ulasan)</Text>
                </View>
                </View>
            </View>
            
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                <Award size={20} color="#d4850c" />
                <Text style={styles.statNumber}>10+</Text>
                <Text style={styles.statLabel}>Tahun</Text>
                </View>
                <View style={styles.statItem}>
                <User size={20} color="#d4850c" />
                <Text style={styles.statNumber}>5000+</Text>
                <Text style={styles.statLabel}>Pelanggan</Text>
                </View>
                <View style={styles.statItem}>
                <Star size={20} color="#d4850c" />
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>Produk</Text>
                </View>
            </View>
            </View>

            <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handleContactPress}>
                <View style={styles.menuIconContainer}>
                <Phone size={24} color="#d4850c" />
                </View>
                <View style={styles.menuContent}>
                <Text style={styles.menuText}>Hubungi Kami</Text>
                <Text style={styles.menuSubtext}>Telepon, WhatsApp, Email</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLocationPress}>
                <View style={styles.menuIconContainer}>
                <MapPin size={24} color="#d4850c" />
                </View>
                <View style={styles.menuContent}>
                <Text style={styles.menuText}>Lokasi Toko</Text>
                <Text style={styles.menuSubtext}>Jl. Raya Bakti No. 123</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleHoursPress}>
                <View style={styles.menuIconContainer}>
                <Clock size={24} color="#d4850c" />
                </View>
                <View style={styles.menuContent}>
                <Text style={styles.menuText}>Jam Operasional</Text>
                <Text style={styles.menuSubtext}>Senin - Minggu: 06:00 - 22:00</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]} onPress={handleAboutPress}>
                <View style={styles.menuIconContainer}>
                <Info size={24} color="#d4850c" />
                </View>
                <View style={styles.menuContent}>
                <Text style={styles.menuText}>Tentang Kami</Text>
                <Text style={styles.menuSubtext}>Sejarah dan komitmen kami</Text>
                </View>
            </TouchableOpacity>
            </View>

            <View style={styles.footer}>
            <Text style={styles.version}>Versi Aplikasi 1.0.0</Text>
            <Text style={styles.copyright}>© 2024 Toko Roti Segar</Text>
            <Text style={styles.tagline}>Dibuat dengan ❤️ untuk pelanggan terbaik</Text>
            </View>
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
    storeInfo: {
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
    storeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    storeLogo: {
        width: 70,
        height: 70,
        backgroundColor: '#d4850c',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    storeLogoText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
    },
    storeDetails: {
        flex: 1,
    },
    storeName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2c1810',
        marginBottom: 4,
    },
    storeTagline: {
        fontSize: 14,
        color: '#6b5b4f',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c1810',
        marginLeft: 4,
    },
    reviews: {
        fontSize: 12,
        color: '#6b5b4f',
        marginLeft: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c1810',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b5b4f',
    },
    menuSection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    lastMenuItem: {
        borderBottomWidth: 0,
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        backgroundColor: '#fff3e0',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuContent: {
        flex: 1,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c1810',
        marginBottom: 2,
    },
    menuSubtext: {
        fontSize: 14,
        color: '#6b5b4f',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    version: {
        fontSize: 14,
        color: '#6b5b4f',
        marginBottom: 4,
    },
    copyright: {
        fontSize: 12,
        color: '#6b5b4f',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 12,
        color: '#d4850c',
        fontStyle: 'italic',
    },
});