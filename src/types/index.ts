// INI FAIL: src/types/index.ts

// Definisi Produk (Ikut standard SaaS)
export interface Product {
    id: string;
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
