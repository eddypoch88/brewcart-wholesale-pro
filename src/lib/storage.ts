import { Product, Order, StoreSettings, CartItem } from '../types';
import { supabase } from './supabase';
import { DEFAULT_SETTINGS } from '../data/mockData';

// ── Products ──
export async function getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    return data || [];
}

export async function getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }
    return data;
}

export async function addProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

    if (error) {
        console.error('Error adding product:', error);
        return null;
    }
    return data;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

    if (error) console.error('Error updating product:', error);
}

export async function deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) console.error('Error deleting product:', error);
}


export async function seedProducts(): Promise<void> {
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (count && count > 0) {
        // Already seeded
        return;
    }

    const sampleProducts = [
        {
            name: "Signature Blend Coffee Beans",
            description: "A rich, full-bodied dark roast with notes of chocolate and molasses. Perfect for espresso.",
            price: 45.00,
            compare_at_price: 55.00,
            stock: 50,
            category: "Coffee Beans",
            sku: "CB-SIG-001",
            status: "active",
            images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Premium Matcha Powder",
            description: "Ceremonial grade matcha from Uji, Kyoto. Vibrant green color and smooth umami flavor.",
            price: 85.00,
            stock: 30,
            category: "Tea",
            sku: "TEA-MAT-001",
            status: "active",
            images: ["https://images.unsplash.com/photo-1515810397858-220d588350fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Caramel Coffee Syrup",
            description: "Rich buttery caramel flavor. Ideal for lattes, frappuccinos, and desserts.",
            price: 28.00,
            stock: 100,
            category: "Syrups",
            sku: "SYR-CAR-001",
            status: "active",
            images: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Oat Milk Barista Edition",
            description: "Creamy plant-based milk formulated specifically for steaming and latte art.",
            price: 18.00,
            stock: 200,
            category: "Milk",
            sku: "MILK-OAT-001",
            status: "active",
            images: ["https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Ceramic Coffee Mug Set",
            description: "Set of 4 handcrafted ceramic mugs. 350ml capacity. Dishwasher safe.",
            price: 120.00,
            compare_at_price: 150.00,
            stock: 15,
            category: "Merchandise",
            sku: "MERCH-MUG-004",
            status: "active",
            images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
        }
    ];

    const { error } = await supabase.from('products').insert(sampleProducts);
    if (error) console.error("Error seeding products:", error);
}

export async function updateProductStock(items: { product: { id: string }, qty: number }[]): Promise<void> {
    // Process sequentially for MVP (Optimistic locking or RPC recommended for high volume)
    for (const item of items) {
        try {
            // 1. Get current stock
            const { data: product, error: fetchError } = await supabase
                .from('products')
                .select('stock')
                .eq('id', item.product.id)
                .single();

            if (fetchError || !product) {
                console.error(`Failed to fetch stock for product ${item.product.id}`, fetchError);
                continue;
            }

            // 2. Calculate new stock
            const newStock = Math.max(0, product.stock - item.qty);

            // 3. Update stock
            const { error: updateError } = await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.product.id);

            if (updateError) {
                console.error(`Failed to update stock for product ${item.product.id}`, updateError);
            }

        } catch (e) {
            console.error("Error in updateProductStock loop:", e);
        }
    }
}

// ── Orders ──
export async function getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
    return data || [];
}

export async function getOrder(id: string): Promise<Order | null> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching order:', error);
        return null;
    }
    return data;
}

export async function createOrder(order: Order): Promise<Order | null> {
    const orderPayload = {
        id: order.id,
        customer_name: order.customer_name,
        phone: order.customer_phone,
        address: order.delivery_address,
        customer_notes: order.customer_notes,
        items: order.items,
        subtotal: order.subtotal,
        delivery_fee: order.delivery_fee,
        total: order.total,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        status: order.status,
        admin_notes: order.admin_notes,
        created_at: order.created_at
    };

    const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

    if (error) {
        console.error('Error creating order:', error.message, error.details);
        return null; // or throw error
    }
    return data;
}

// Alias for compatibility if needed, but createOrder is better name
export const saveOrders = async (orders: Order[]) => {
    console.warn('saveOrders is deprecated, use createOrder or bulk insert');
    // For migration, we might ignore this or implement bulk upsert
};

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

    if (error) console.error('Error updating order status:', error);
}

export async function updateOrderNotes(id: string, admin_notes: string): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({ admin_notes })
        .eq('id', id);

    if (error) console.error('Error updating order notes:', error);
}

export async function deleteOrders(ids: string[]): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .delete()
        .in('id', ids);

    if (error) console.error('Error deleting orders:', error);
}

export const updateOrderPaymentMethod = async (orderId: string, method: string) => {
    const { error } = await supabase
        .from('orders')
        .update({ payment_method: method })
        .eq('id', orderId);

    if (error) throw error;
};

// ── Receipt Upload ──
export async function uploadPaymentProof(orderId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}-${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (uploadError) {
        console.error('Error uploading receipt:', uploadError);
        return null;
    }

    const { data } = supabase.storage.from('receipts').getPublicUrl(filePath);
    return data.publicUrl;
}

export async function updatePaymentProof(
    orderId: string,
    proofUrl: string,
    paymentStatus: 'unpaid' | 'pending_verification' | 'paid' = 'pending_verification'
): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({
            payment_proof: proofUrl,
            payment_status: paymentStatus
        })
        .eq('id', orderId);

    if (error) {
        console.error('Error updating payment proof:', error);
        throw error;
    }
}

export async function updatePaymentStatus(
    orderId: string,
    status: 'unpaid' | 'pending_verification' | 'paid'
): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);

    if (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
}

// ── Settings ──
export const getSettings = async (): Promise<StoreSettings> => {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

    if (error || !data) {
        console.log("Settings not found, returning defaults");
        return DEFAULT_SETTINGS;
    }

    // Map DB columns back to StoreSettings
    return {
        ...DEFAULT_SETTINGS,
        store_name: data.store_name,
        whatsapp_number: data.whatsapp,
        currency: data.currency,
        delivery_fee: data.delivery_fee,
        free_delivery_threshold: data.free_delivery_threshold,
        bank_name: data.bank_name || '',
        bank_holder_name: data.bank_holder_name || data.bank_account_name || '',
        bank_account_number: data.bank_account || '',
    };
}

export async function saveSettings(settings: StoreSettings): Promise<void> {
    // Map StoreSettings -> DB Columns
    const settingsPayload = {
        id: 1,
        store_name: settings.store_name,
        whatsapp: settings.whatsapp_number, // Map 'whatsapp_number' -> 'whatsapp'
        currency: settings.currency,
        delivery_fee: settings.delivery_fee,
        free_delivery_threshold: settings.free_delivery_threshold,
        bank_account: settings.bank_account_number,
        // Add other mapped fields if needed
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from('settings')
        .upsert(settingsPayload);

    if (error) console.error('Error saving settings:', error);
}

// ── Cart (LocalStorage - Client Side Only) ──
const CART_KEY = 'brewcart_cart';

export function getCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveCart(cart: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: CartItem) {
    const cart = getCart();
    const existing = cart.find(c => c.product.id === item.product.id);
    if (existing) {
        existing.qty += item.qty;
    } else {
        cart.push(item);
    }
    saveCart(cart);
    return cart;
}

export function removeFromCart(productId: string) {
    saveCart(getCart().filter(c => c.product.id !== productId));
}

export function updateCartQty(productId: string, qty: number) {
    if (qty <= 0) return removeFromCart(productId);
    const cart = getCart().map(c => c.product.id === productId ? { ...c, qty } : c);
    saveCart(cart);
}

export function clearCart() {
    saveCart([]);
}
