import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, TextInput, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ShoppingCart, Search, MapPin } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase'; 
export default function HomeScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'bread' | 'cake'>('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error('Error fetching products:', error);
        } else {
            setProducts(data as Product[]);
        }
        setLoading(false);
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        }).format(price);

    const handleAddToCart = () => {
        if (selectedProduct) {
        addToCart(selectedProduct);
        setSelectedProduct(null);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <View style={styles.headerTop}>
            <View>
                <Text style={styles.greeting}>Selamat datang di</Text>
                <Text style={styles.title}>Kuy Bakery</Text>
            </View>
            <View style={styles.locationContainer}>
                <MapPin size={16} color="#fff" />
                <Text style={styles.location}>Jakarta Selatan</Text>
            </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
            <Search size={20} color="#6b5b4f" />
            <TextInput
                style={styles.searchInput}
                placeholder="Cari roti atau kue..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#6b5b4f"
            />
            </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            {(['all', 'bread', 'cake'] as const).map(category => (
                <TouchableOpacity
                key={category}
                style={[styles.filterButton, selectedCategory === category && styles.filterButtonActive]}
                onPress={() => setSelectedCategory(category)}
                >
                <Text style={[styles.filterText, selectedCategory === category && styles.filterTextActive]}>
                    {category === 'all' ? 'Semua Produk' : category === 'bread' ? 'Roti' : 'Kue'}
                </Text>
                </TouchableOpacity>
            ))}
            </ScrollView>
        </View>

        {/* Products List */}
        {loading ? (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#d4850c" />
            </View>
        ) : (
            <ScrollView style={styles.productList} showsVerticalScrollIndicator={false}>
            <View style={styles.productsGrid}>
                {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onPress={() => setSelectedProduct(product)} />
                ))}
            </View>

            {filteredProducts.length === 0 && (
                <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Tidak ada produk yang ditemukan</Text>
                </View>
            )}
            </ScrollView>
        )}

        {/* Product Modal */}
        <Modal
            visible={!!selectedProduct}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setSelectedProduct(null)}
        >
            {selectedProduct && (
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedProduct(null)}>
                    <X size={24} color="#2c1810" />
                </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                <View style={styles.modalInfo}>
                    <View style={styles.modalTitleRow}>
                    <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                        {selectedProduct.category === 'bread' ? 'Roti' : 'Kue'}
                        </Text>
                    </View>
                    </View>
                    <Text style={styles.modalPrice}>{formatPrice(selectedProduct.price)}</Text>
                    <Text style={styles.modalDescription}>{selectedProduct.description}</Text>

                    <View style={styles.featuresContainer}>
                    <Text style={styles.featuresTitle}>Keunggulan:</Text>
                    <Text style={styles.featureItem}>• Bahan berkualitas tinggi</Text>
                    <Text style={styles.featureItem}>• Dibuat fresh setiap hari</Text>
                    <Text style={styles.featureItem}>• Tanpa pengawet berbahaya</Text>
                    <Text style={styles.featureItem}>• Higienis dan halal</Text>
                    </View>
                </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <ShoppingCart size={20} color="#fff" />
                    <Text style={styles.addToCartText}>Tambah ke Keranjang</Text>
                </TouchableOpacity>
                </View>
            </SafeAreaView>
            )}
        </Modal>
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
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginTop: 4,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    location: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 4,
        fontWeight: '500',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#2c1810',
        marginLeft: 12,
    },
    filterContainer: {
        paddingVertical: 16,
    },
    filterContent: {
        paddingHorizontal: 20,
    },
    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e1e1e1',
        marginRight: 12,
    },
    filterButtonActive: {
        backgroundColor: '#d4850c',
        borderColor: '#d4850c',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b5b4f',
    },
    filterTextActive: {
        color: '#fff',
    },
    productList: {
        flex: 1,
    },
    productsGrid: {
        paddingHorizontal: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#6b5b4f',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
    },
    modalContent: {
        flex: 1,
    },
    modalImage: {
        width: '100%',
        height: 300,
    },
    modalInfo: {
        padding: 20,
    },
    modalTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c1810',
        flex: 1,
        marginRight: 12,
    },
    categoryBadge: {
        backgroundColor: '#d4850c',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    modalPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#d4850c',
        marginBottom: 16,
    },
    modalDescription: {
        fontSize: 16,
        color: '#6b5b4f',
        lineHeight: 24,
        marginBottom: 20,
    },
    featuresContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
    },
    featuresTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c1810',
        marginBottom: 8,
    },
    featureItem: {
        fontSize: 14,
        color: '#6b5b4f',
        lineHeight: 20,
        marginBottom: 4,
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    addToCartButton: {
        backgroundColor: '#d4850c',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});