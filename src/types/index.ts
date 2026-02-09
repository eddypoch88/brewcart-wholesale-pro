// INI FAIL: src/types/index.ts

// Definisi Store (Multi-tenant)
export interface Store {
    id: string;
    store_name: string;
    domain: string;
    logo_url?: string;
    whatsapp_number?: string;
    created_at: string;
}

// Definisi Produk (Ikut standard SaaS)
export interface Product {
    id: string;
    store_id: string; // Foreign Key to Store
    name: string;
    slug?: string;
    description?: string;
    price: number;
    compare_at_price?: number; // Harga asal (untuk diskaun)
    cost_per_item?: number;    // Kos modal (untuk kira untung)
    sku?: string;              // Kod barang
    stock: number;
    category?: string;
    status: 'active' | 'draft' | 'archived';
    images: string[];
    created_at: string;
}

// Definisi Setting Kedai
export interface StoreConfig {
    id: number;
    store_id: string; // Foreign Key to Store
    store_name: string;
    whatsapp_number?: string;
    currency: string;
    support_email?: string;
    theme_color?: string;
}

// Standard Response dari Database (Supaya senang debug)
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}
