import { Product, Order, StoreSettings, CartItem } from '../types';
import { supabase } from './supabase';
import { DEFAULT_SETTINGS } from '../data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// !! MULTI-TENANT NOTICE !!
// All functions that touch products, orders, or store_settings now require
// a `storeId` param. This scopes every query to the current seller's store.
// RLS on Supabase is a second layer of defense; the storeId filter here is
// the primary/explicit guard on the client side.
// ─────────────────────────────────────────────────────────────────────────────

// ── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(storeId: string): Promise<Product[]> {
    if (!storeId) {
        console.warn('[getProducts] No storeId provided — returning empty array');
        return [];
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)                  // ← multi-tenant filter
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[getProducts] Error:', error.message, error.code);
        return [];
    }

    return data || [];
}

export async function getProduct(id: string, storeId: string): Promise<Product | null> {
    if (!storeId) return null;

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('store_id', storeId)                  // ← multi-tenant filter
        .single();

    if (error) {
        console.error('[getProduct] Error:', error.message);
        return null;
    }
    return data;
}

// Storefront variant — no storeId required but storeId from URL slug is passed
export async function getProductPublic(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();

    if (error) {
        console.error('[getProductPublic] Error:', error.message);
        return null;
    }
    return data;
}

export async function addProduct(
    product: Omit<Product, 'id' | 'created_at'>,
    storeId: string
): Promise<Product | null> {
    if (!storeId) {
        console.error('[addProduct] No storeId — aborting');
        return null;
    }

    const payload = {
        ...product,
        store_id: storeId,                        // ← attach to store
        status: product.status || 'active',
    };

    const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

    if (error) {
        console.error('[addProduct] Error:', error.message);
        return null;
    }
    return data;
}

export async function updateProduct(
    id: string,
    updates: Partial<Product>,
    storeId: string
): Promise<void> {
    if (!storeId) { console.error('[updateProduct] No storeId — aborting'); return; }

    const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .eq('store_id', storeId);                 // ← safety: only own store

    if (error) console.error('[updateProduct] Error:', error.message);
}

export async function deleteProduct(id: string, storeId: string): Promise<void> {
    if (!storeId) { console.error('[deleteProduct] No storeId — aborting'); return; }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('store_id', storeId);                 // ← safety: only own store

    if (error) console.error('[deleteProduct] Error:', error.message);
}

export async function updateProductStock(
    items: { product: { id: string }; qty: number }[],
    storeId: string
): Promise<void> {
    for (const item of items) {
        try {
            const { data: product, error: fetchError } = await supabase
                .from('products')
                .select('stock')
                .eq('id', item.product.id)
                .eq('store_id', storeId)
                .single();

            if (fetchError || !product) {
                console.error(`[updateProductStock] Fetch failed for ${item.product.id}`, fetchError);
                continue;
            }

            const newStock = Math.max(0, product.stock - item.qty);

            const { error: updateError } = await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.product.id)
                .eq('store_id', storeId);

            if (updateError) {
                console.error(`[updateProductStock] Update failed for ${item.product.id}`, updateError);
            }
        } catch (e) {
            console.error('[updateProductStock] Loop error:', e);
        }
    }
}

/**
 * seedProducts — inserts sample products for demo/testing.
 * Requires a storeId to associate the seeded products with a store.
 */
export async function seedProducts(storeId: string): Promise<void> {
    if (!storeId) {
        throw new Error('[seedProducts] storeId is required');
    }

    const sampleProducts = [
        { name: 'Tiger Beer 24x330ml', price: 78.00, stock: 50, category: 'Beer', status: 'active' as const, images: [], store_id: storeId, description: 'Classic Tiger lager in convenient cans.', created_at: new Date().toISOString() },
        { name: 'Heineken 24x330ml', price: 88.00, stock: 30, category: 'Beer', status: 'active' as const, images: [], store_id: storeId, description: 'Premium Dutch pilsner, smooth and refreshing.', created_at: new Date().toISOString() },
        { name: 'Carlsberg 24x330ml', price: 72.00, stock: 40, category: 'Beer', status: 'active' as const, images: [], store_id: storeId, description: 'Smooth Carlsberg lager, Malaysia\'s favourite.', created_at: new Date().toISOString() },
        { name: 'Corona Extra 24x355ml', price: 98.00, stock: 20, category: 'Beer', status: 'active' as const, images: [], store_id: storeId, description: 'Mexican lager best served with a wedge of lime.', created_at: new Date().toISOString() },
        { name: 'Guinness Stout 24x320ml', price: 92.00, stock: 25, category: 'Stout', status: 'active' as const, images: [], store_id: storeId, description: 'Rich dark Irish stout with a creamy head.', created_at: new Date().toISOString() },
    ];

    const { error } = await supabase.from('products').insert(sampleProducts);
    if (error) {
        console.error('[seedProducts] Error:', error.message);
        throw error;
    }
}



export async function getOrders(storeId: string): Promise<Order[]> {
    if (!storeId) {
        console.warn('[getOrders] No storeId — returning empty array');
        return [];
    }

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[getOrders] Error:', error.message);
        return [];
    }

    // Normalize DB columns (phone, address) → frontend type fields (customer_phone, delivery_address)
    return (data || []).map(row => ({
        ...row,
        customer_phone: row.customer_phone || row.phone || '',
        delivery_address: row.delivery_address || row.address || '',
    }));
}

export async function getOrder(id: string, storeId?: string): Promise<Order | null> {
    let query = supabase.from('orders').select('*').eq('id', id);

    // Admin context: scope to store. Public order-review page: no storeId needed.
    if (storeId) {
        query = query.eq('store_id', storeId);
    }

    const { data, error } = await query.single();

    if (error) {
        console.error('[getOrder] Error:', error.message);
        return null;
    }
    return data;
}

export async function createOrder(order: Order, storeId: string): Promise<Order | null> {
    if (!storeId) {
        console.error('[createOrder] No storeId — aborting');
        return null;
    }

    const orderPayload = {
        id: order.id,
        store_id: storeId,                        // ← attach to store
        customer_name: order.customer_name,
        phone: order.customer_phone,              // ← fixed: customer_phone → phone
        address: order.delivery_address,          // ← fixed: delivery_address → address
        customer_notes: order.customer_notes,
        items: order.items,
        subtotal: order.subtotal,
        delivery_fee: order.delivery_fee,
        total: order.total,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        status: order.status,
        admin_notes: order.admin_notes,
        created_at: order.created_at,
    };

    const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

    if (error) {
        console.error('[createOrder] Error:', error.message, error.details);
        return null;
    }
    return data;
}

export async function updateOrderStatus(
    id: string,
    status: Order['status'],
    storeId: string
): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .eq('store_id', storeId);

    if (error) console.error('[updateOrderStatus] Error:', error.message);
}

export async function updateOrderNotes(
    id: string,
    admin_notes: string,
    storeId: string
): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({ admin_notes })
        .eq('id', id)
        .eq('store_id', storeId);

    if (error) console.error('[updateOrderNotes] Error:', error.message);
}

export async function deleteOrders(ids: string[], storeId: string): Promise<void> {
    if (!storeId) { console.error('[deleteOrders] No storeId — aborting'); return; }

    const { error } = await supabase
        .from('orders')
        .delete()
        .in('id', ids)
        .eq('store_id', storeId);

    if (error) console.error('[deleteOrders] Error:', error.message);
}

export const updateOrderPaymentMethod = async (
    orderId: string,
    method: string,
    storeId: string
): Promise<void> => {
    const { error } = await supabase
        .from('orders')
        .update({ payment_method: method })
        .eq('id', orderId)
        .eq('store_id', storeId);

    if (error) throw error;
};

// ── Receipt / File Uploads ─────────────────────────────────────────────────

export async function uploadPaymentProof(orderId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}-${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
        console.error('[uploadPaymentProof] Error:', uploadError);
        return null;
    }

    const { data } = supabase.storage.from('receipts').getPublicUrl(filePath);
    return data.publicUrl;
}

export async function uploadProductImage(file: File, storeId: string): Promise<string> {
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) throw new Error('Image size must be less than 2MB');

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) throw new Error('Only JPG, PNG and WebP images are allowed');

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    // Store under store-specific folder for isolation
    const filePath = `${storeId}/images/${Date.now()}-${cleanName}`;

    const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
        console.error('[uploadProductImage] Error:', uploadError);
        throw new Error('Failed to upload image to storage');
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    return data.publicUrl;
}

export const deleteProductImage = async (imageUrl: string): Promise<void> => {
    const path = imageUrl.split('/product-images/')[1];
    if (!path) return;
    await supabase.storage.from('product-images').remove([path]);
};

export async function updatePaymentProof(
    orderId: string,
    proofUrl: string,
    paymentStatus: 'unpaid' | 'pending_verification' | 'paid' = 'pending_verification'
): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({ payment_proof: proofUrl, payment_status: paymentStatus })
        .eq('id', orderId);

    if (error) { console.error('[updatePaymentProof] Error:', error); throw error; }
}

export async function updatePaymentStatus(
    orderId: string,
    status: 'unpaid' | 'pending_verification' | 'paid',
    storeId: string
): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId)
        .eq('store_id', storeId);

    if (error) { console.error('[updatePaymentStatus] Error:', error); throw error; }
}

// ── Settings (store_settings table) ──────────────────────────────────────────

/**
 * getSettings — fetches settings for a specific store.
 * Replaces old pattern of `.eq('id', 1)` with `.eq('store_id', storeId)`.
 *
 * Falls back to DEFAULT_SETTINGS if none found (new store, not yet configured).
 */
export const getSettings = async (storeId: string): Promise<StoreSettings> => {
    if (!storeId) {
        console.warn('[getSettings] No storeId — returning defaults');
        return DEFAULT_SETTINGS;
    }

    const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('store_id', storeId)
        .maybeSingle();                           // ← no 406 for missing row

    if (error) {
        console.error('[getSettings] Error:', error.message);
        return DEFAULT_SETTINGS;
    }
    if (!data) {
        // New store — no settings row yet. Defaults will be used until admin saves.
        return DEFAULT_SETTINGS;
    }

    // Map DB columns → StoreSettings interface
    return {
        ...DEFAULT_SETTINGS,
        store_name: data.store_name || DEFAULT_SETTINGS.store_name,
        whatsapp_number: data.whatsapp || DEFAULT_SETTINGS.whatsapp_number,
        currency: data.currency || DEFAULT_SETTINGS.currency,
        theme_color: data.theme_color || DEFAULT_SETTINGS.theme_color,
        logo_url: data.logo_url || '',
        timezone: data.timezone || DEFAULT_SETTINGS.timezone,
        delivery_fee: data.delivery_fee ?? DEFAULT_SETTINGS.delivery_fee,
        free_delivery_threshold: data.free_delivery_threshold ?? DEFAULT_SETTINGS.free_delivery_threshold,
        enable_self_pickup: data.enable_self_pickup ?? DEFAULT_SETTINGS.enable_self_pickup,
        accept_cod: data.accept_cod ?? DEFAULT_SETTINGS.accept_cod,
        accept_bank_transfer: data.accept_bank_transfer ?? DEFAULT_SETTINGS.accept_bank_transfer,
        bank_name: data.bank_name || '',
        bank_holder_name: data.bank_holder_name || data.bank_account_name || '',
        bank_account_number: data.bank_account || '',
        qr_code_url: data.qr_code_url || '',
        operating_hours: data.operating_hours || DEFAULT_SETTINGS.operating_hours,
        whatsapp_order_notifications: data.whatsapp_order_notifications ?? DEFAULT_SETTINGS.whatsapp_order_notifications,
        fb_pixel_id: data.fb_pixel_id || '',
        google_analytics_id: data.google_analytics_id || '',
        tiktok_pixel_id: data.tiktok_pixel_id || '',
        stripe_publishable_key: data.stripe_publishable_key || '',
        stripe_secret_key: data.stripe_secret_key || '',
        is_stripe_enabled: data.is_stripe_enabled || false,
        toyyibpay_secret_key: data.toyyibpay_secret_key || '',
        toyyibpay_category_code: data.toyyibpay_category_code || '',
        is_toyyibpay_enabled: data.is_toyyibpay_enabled || false,
    };
};

/**
 * saveSettings — upserts settings for a specific store.
 * Uses store_id as the unique key instead of id=1.
 */
export async function saveSettings(settings: StoreSettings, storeId: string): Promise<void> {
    if (!storeId) {
        console.error('[saveSettings] No storeId — aborting save');
        throw new Error('Store ID is required to save settings');
    }

    const settingsPayload = {
        store_id: storeId,                        // ← multi-tenant key
        store_name: settings.store_name,
        whatsapp: settings.whatsapp_number,
        currency: settings.currency,
        theme_color: settings.theme_color,
        logo_url: settings.logo_url,
        timezone: settings.timezone,
        delivery_fee: settings.delivery_fee,
        free_delivery_threshold: settings.free_delivery_threshold,
        enable_self_pickup: settings.enable_self_pickup,
        accept_cod: settings.accept_cod,
        accept_bank_transfer: settings.accept_bank_transfer,
        bank_account: settings.bank_account_number,
        bank_name: settings.bank_name,
        bank_holder_name: settings.bank_holder_name,
        qr_code_url: settings.qr_code_url,
        operating_hours: settings.operating_hours,
        whatsapp_order_notifications: settings.whatsapp_order_notifications,
        fb_pixel_id: settings.fb_pixel_id,
        google_analytics_id: settings.google_analytics_id,
        tiktok_pixel_id: settings.tiktok_pixel_id,
        stripe_publishable_key: settings.stripe_publishable_key,
        stripe_secret_key: settings.stripe_secret_key,
        is_stripe_enabled: settings.is_stripe_enabled,
        toyyibpay_secret_key: settings.toyyibpay_secret_key,
        toyyibpay_category_code: settings.toyyibpay_category_code,
        is_toyyibpay_enabled: settings.is_toyyibpay_enabled,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from('store_settings')
        .upsert(settingsPayload, { onConflict: 'store_id' }); // ← upsert by store_id

    if (error) {
        console.error('[saveSettings] Error:', error.message, error.details);
        throw error;
    }
}

/**
 * updateStoreName — updates the canonical store name in the `stores` table.
 *
 * `stores.name` is the SINGLE SOURCE OF TRUTH for the store name.
 * `store_settings.store_name` is kept only for legacy reads (backward compat).
 * All new code should read the name from StoreContext which merges stores.name.
 */
export async function updateStoreName(storeId: string, name: string): Promise<void> {
    if (!storeId || !name.trim()) {
        console.error('[updateStoreName] storeId and name are required');
        return;
    }

    const { error } = await supabase
        .from('stores')
        .update({ name: name.trim(), updated_at: new Date().toISOString() })
        .eq('id', storeId);

    if (error) {
        console.error('[updateStoreName] Error:', error.message);
        throw error;
    }
}


// ── Storefront: Public Settings Fetch (by slug, no auth needed) ──────────────

/**
 * getSettingsBySlug — used by the customer storefront to fetch store config.
 * Joins stores → store_settings by slug. No auth required (RLS allows public read).
 */
export async function getSettingsBySlug(slug: string): Promise<StoreSettings | null> {
    const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', slug)
        .single();

    if (storeError || !storeData) {
        console.error('[getSettingsBySlug] Store not found for slug:', slug);
        return null;
    }

    return getSettings(storeData.id);
}

/**
 * getProductsBySlug — used by storefront to fetch active products for a store slug.
 */
export async function getProductsBySlug(slug: string): Promise<Product[]> {
    const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', slug)
        .single();

    if (storeError || !storeData) return [];

    return getProducts(storeData.id);
}

/**
 * getPublicStoreId — resolves the active store's ID without requiring auth.
 *
 * For single-tenant deployments (one store per app), this fetches the first
 * store in the DB. For multi-tenant setups with slugs in the URL, use
 * getSettingsBySlug() / getProductsBySlug() instead.
 *
 * Result is cached in sessionStorage to avoid repeated roundtrips per page load.
 */
export async function getPublicStoreId(slug?: string): Promise<string | null> {
    const CACHE_KEY = slug ? `brewcart_public_store_id_${slug}` : 'brewcart_public_store_id';
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return cached;

    let query = supabase.from('stores').select('id');

    if (slug) {
        // Look up by slug — precise, correct store every time
        query = query.eq('slug', slug).limit(1);
    } else {
        // No slug provided — not recommended for multi-tenant, but kept as fallback
        console.warn('[getPublicStoreId] No slug provided — fetching first store in DB. This may return the wrong store!');
        query = query.limit(1);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
        console.warn('[getPublicStoreId] No store found:', error?.message);
        return null;
    }

    sessionStorage.setItem(CACHE_KEY, data.id);
    return data.id;
}


// ── Cart (LocalStorage — client-side only, no store_id needed) ───────────────

const CART_KEY = 'brewcart_cart';

export function getCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
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
    saveCart(getCart().map(c => c.product.id === productId ? { ...c, qty } : c));
}

export function clearCart() {
    saveCart([]);
}
