export interface Order {
    id: string;
    store_id: string;
    order_number: number;
    customer_name: string;
    customer_phone: string | null;
    customer_email?: string | null;
    customer_address?: string | null;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_method?: 'whatsapp' | 'fpx' | 'qr' | 'bank_transfer' | null;
    payment_status?: 'unpaid' | 'paid' | 'partial' | null;
    receipt_url: string | null;
    items: OrderItem[];
    notes?: string | null;
    created_at: string;
    updated_at?: string;
}

export interface OrderItem {
    product_id: string;
    product: {
        id: string;
        name: string;
        price: number;
        images?: string[];
    };
    qty: number;
    price_at_time: number; // Price when order was placed
}
