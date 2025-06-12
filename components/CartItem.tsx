import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
    item: CartItemType;
    }

    export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeFromCart } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <View style={styles.container}>
        <Image source={{ uri: item.product.image }} style={styles.image} />
        
        <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>{item.product.name}</Text>
            <Text style={styles.price}>{formatPrice(item.product.price)}</Text>
            
            <View style={styles.controls}>
            <View style={styles.quantityContainer}>
                <TouchableOpacity
                style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                >
                <Minus size={16} color={item.quantity <= 1 ? '#ccc' : '#d4850c'} />
                </TouchableOpacity>
                
                <Text style={styles.quantity}>{item.quantity}</Text>
                
                <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                <Plus size={16} color="#d4850c" />
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.product.id)}
            >
                <Trash2 size={18} color="#e74c3c" />
            </TouchableOpacity>
            </View>
        </View>
        
        <View style={styles.totalContainer}>
            <Text style={styles.total}>
            {formatPrice(item.product.price * item.quantity)}
            </Text>
        </View>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    content: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c1810',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        color: '#6b5b4f',
        marginBottom: 8,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d4850c',
        borderRadius: 6,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonDisabled: {
        borderColor: '#ccc',
        backgroundColor: '#f5f5f5',
    },
    quantity: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c1810',
        marginHorizontal: 16,
        minWidth: 24,
        textAlign: 'center',
    },
    removeButton: {
        padding: 8,
    },
    totalContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    total: {
        fontSize: 16,
        fontWeight: '700',
        color: '#d4850c',
    },
});