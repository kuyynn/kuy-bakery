import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { ShoppingCart, Star } from 'lucide-react-native';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
    product: Product;
    onPress: () => void;
    }

    export function ProductCard({ product, onPress }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: any) => {
        e.stopPropagation();
        addToCart(product);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Pressable style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
        ]} onPress={onPress}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
                {product.category === 'bread' ? 'Roti' : 'Kue'}
            </Text>
            </View>
        </View>
        
        <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
            <Text style={styles.description} numberOfLines={2}>
            {product.description}
            </Text>
            
            <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>4.8</Text>
            <Text style={styles.reviews}>(127 ulasan)</Text>
            </View>
            
            <View style={styles.footer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleAddToCart}
                activeOpacity={0.8}
            >
                <ShoppingCart size={16} color="#fff" />
            </TouchableOpacity>
            </View>
        </View>
        </Pressable>
    );
    }

    const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
    },
    cardPressed: {
        transform: [{ scale: 0.98 }],
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 180,
    },
    categoryBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(212, 133, 12, 0.9)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c1810',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: '#6b5b4f',
        lineHeight: 20,
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#d4850c',
    },
    addButton: {
        backgroundColor: '#d4850c',
        borderRadius: 24,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#d4850c',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
});