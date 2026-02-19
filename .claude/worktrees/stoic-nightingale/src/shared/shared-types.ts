// Supabase - Json Type Helper
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type ViewType = 'home' | 'analytics' | 'inventory' | 'orders' | 'profile';

export interface StoreConfig {
    id: number;
    store_name: string;
    whatsapp_number: string | null;
    bank_name: string | null;
    bank_account_no: string | null;
    bank_holder_name: string | null;
    qr_code_url: string | null;
    fb_pixel_id: string | null;
    google_ads_id: string | null;
    theme_color: string;
    updated_at: string;
}

export interface Product {
    id: string; // uuid
    name: string;
    slug: string | null;
    price: number; // numeric -> number
    original_price: number | null;
    description: string | null;
    images: string[] | null;
    category: string | null;
    stock: number;
    is_active: boolean;
    metadata: Json | null;
    created_at: string;
    // Helper fields for UI compatibility (optional)
    status?: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Order {
    id: string; // uuid
    order_number: number;
    customer_name: string;
    customer_phone: string | null;
    total_amount: number;
    status: string; // 'pending' | 'paid' | ...
    receipt_url: string | null;
    items: Json; // Stored as JSONB
    created_at: string;
}

// Deprecated or UI-only types (keep if needed for transition)
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