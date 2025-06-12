export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: 'bread' | 'cake';
    available: boolean;
    }

    export interface CartItem {
    product: Product;
    quantity: number;
    }

    export interface CustomerInfo {
    name: string;
    phone: string;
    address: string;
    latitude?: number;
    longitude?: number;
    }

    export interface Order {
    id: string;
    items: CartItem[];
    customer: CustomerInfo;
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
    createdAt: Date;
}