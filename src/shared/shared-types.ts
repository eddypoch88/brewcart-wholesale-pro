export type ViewType = 'home' | 'analytics' | 'inventory' | 'orders' | 'profile';

export interface StoreConfig {
    shopId: string;
    storeName: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    heroTitle: string;
    heroSubtitle: string;
    currency: string;
    contactNumber: string;
}

export interface Product {
    id: string | number;
    name: string;
    price: string;
    stock: number;
    description?: string;
    image: string;
    category: string;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Order {
    id: string | number;
    title: string;
    amount: string;
    date: string;
    status: 'Pending' | 'Completed' | 'Paid';
    items?: Product[];
}

export interface Transaction {
    id: number;
    title: string;
    subtitle: string;
    amount: string;
    date: string;
    type: 'income' | 'expense';
    status: 'Pending' | 'Completed' | 'Paid';
    icon: string;
    iconBg: string;
    iconColor: string;
}