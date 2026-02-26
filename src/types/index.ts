// ── Types ──

// ── Multi-tenant: Store ──
export interface Store {
    id: string;
    owner_id: string;
    name: string;
    slug: string;
    subdomain: string | null;
    custom_domain: string | null;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    store_id?: string;              // ← multi-tenant: links product to a store
    name: string;
    slug?: string;
    description?: string;
    price: number;
    compare_at_price?: number;
    cost_per_item?: number;
    sku?: string;
    stock: number;
    category?: string;
    status: 'active' | 'draft' | 'archived';
    images: string[];
    variants?: ProductVariant[];
    low_stock_threshold?: number;
    created_at: string;
}

export interface ProductVariant {
    name: string;
    options: VariantOption[];
}

export interface VariantOption {
    name: string;
    price_modifier?: number;
    sku_suffix?: string;
}

export interface OrderItem {
    product: Pick<Product, 'id' | 'name' | 'price' | 'images'>;
    qty: number;
    selectedVariant?: SelectedVariant;     // ← variant the customer chose
}

/** Stores the customer's variant selection for a cart/order item */
export interface SelectedVariant {
    /** e.g. "Size: 1kg" or "Size: 1kg, Color: Dark Roast" */
    label: string;
    /** Price modifier from base price (can be positive or negative) */
    priceModifier: number;
}

export interface Order {
    id: string;
    store_id?: string;              // ← multi-tenant: links order to a store
    customer_name: string;
    customer_phone: string;
    items: OrderItem[];
    subtotal?: number;
    delivery_fee?: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    delivery_address?: string;
    payment_method?: string;
    payment_proof?: string;
    payment_status?: 'paid' | 'unpaid' | 'pending_verification';
    customer_notes?: string;
    admin_notes?: string;
}

export interface StoreSettings {
    store_name: string;
    whatsapp_number: string;
    currency: string;
    theme_color: string;

    // Branding
    logo_url: string;

    // Currency & Regional
    timezone: string;

    // Delivery Settings
    delivery_fee: number;
    free_delivery_threshold: number;
    enable_self_pickup: boolean;

    // Payment Methods
    accept_cod: boolean;
    accept_bank_transfer: boolean;
    bank_name: string;
    bank_holder_name: string;
    bank_account_number: string;
    qr_code_url: string;

    // Operating Hours
    operating_hours: {
        monday: { open: string; close: string; closed: boolean };
        tuesday: { open: string; close: string; closed: boolean };
        wednesday: { open: string; close: string; closed: boolean };
        thursday: { open: string; close: string; closed: boolean };
        friday: { open: string; close: string; closed: boolean };
        saturday: { open: string; close: string; closed: boolean };
        sunday: { open: string; close: string; closed: boolean };
    };

    // Notifications
    whatsapp_order_notifications: boolean;

    // Marketing Integrations
    fb_pixel_id?: string;
    google_analytics_id?: string;
    tiktok_pixel_id?: string;

    // Payment Gateways
    stripe_publishable_key?: string;
    stripe_secret_key?: string;
    is_stripe_enabled?: boolean;
    toyyibpay_secret_key?: string;
    toyyibpay_category_code?: string;
    is_toyyibpay_enabled?: boolean;
}

export interface CartItem {
    product: Pick<Product, 'id' | 'name' | 'price' | 'images'>;
    qty: number;
    selectedVariant?: SelectedVariant;     // ← variant the customer chose
}

