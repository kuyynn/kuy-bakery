import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from 'types';

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    }

    const CartContext = createContext<CartContextType | undefined>(undefined);

    export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        setItems(prevItems => {
        const existingItem = prevItems.find(item => item.product.id === product.id);
        if (existingItem) {
            return prevItems.map(item =>
            item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
        }
        return [...prevItems, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
        removeFromCart(productId);
        return;
        }
        setItems(prevItems =>
        prevItems.map(item =>
            item.product.id === productId
            ? { ...item, quantity }
            : item
        )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider
        value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalPrice,
            getTotalItems,
        }}
        >
        {children}
        </CartContext.Provider>
    );
    }

    export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}