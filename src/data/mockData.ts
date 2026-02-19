import { Product, Order, StoreSettings } from '../types';

export const DEFAULT_SETTINGS: StoreSettings = {
    store_name: 'BrewCart Pro',
    whatsapp_number: '60123456789',
    currency: 'MYR',
    theme_color: '#2563eb',

    // Branding
    logo_url: '',

    // Currency & Regional
    timezone: 'Asia/Kuala_Lumpur',

    // Delivery Settings
    delivery_fee: 10.00,
    free_delivery_threshold: 50.00,
    enable_self_pickup: true,

    // Payment Methods
    accept_cod: true,
    accept_bank_transfer: true,
    bank_name: '',
    bank_holder_name: '',
    bank_account_number: '',

    // Operating Hours
    operating_hours: {
        monday: { open: '08:00', close: '18:00', closed: false },
        tuesday: { open: '08:00', close: '18:00', closed: false },
        wednesday: { open: '08:00', close: '18:00', closed: false },
        thursday: { open: '08:00', close: '18:00', closed: false },
        friday: { open: '08:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '17:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: true },
    },

    // Notifications
    whatsapp_order_notifications: true,
};

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'Signature Cold Brew',
        description: 'Our flagship cold-brewed coffee, steeped for 18 hours for a smooth, bold flavor with low acidity. Perfect served over ice.',
        price: 18.90,
        compare_at_price: 22.00,
        sku: 'CB-001',
        stock: 45,
        category: 'Coffee',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop'],
        created_at: '2026-01-10T08:00:00Z',
    },
    {
        id: 'p2',
        name: 'Matcha Ceremonial Latte',
        description: 'Premium Japanese ceremonial-grade matcha blended with creamy oat milk. Naturally sweet with a rich umami finish.',
        price: 16.50,
        sku: 'MT-001',
        stock: 32,
        category: 'Tea',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop'],
        created_at: '2026-01-12T10:00:00Z',
    },
    {
        id: 'p3',
        name: 'Tropical Mango Smoothie',
        description: 'Freshly blended mango with coconut cream and a hint of lime. A refreshing tropical escape in every sip.',
        price: 14.90,
        compare_at_price: 18.00,
        sku: 'SM-001',
        stock: 28,
        category: 'Smoothie',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop'],
        created_at: '2026-01-15T09:30:00Z',
    },
    {
        id: 'p4',
        name: 'Espresso Double Shot',
        description: 'Intense double-shot espresso with caramel notes. Made from single-origin beans roasted in small batches.',
        price: 12.00,
        sku: 'ES-001',
        stock: 60,
        category: 'Coffee',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop'],
        created_at: '2026-01-18T11:00:00Z',
    },
    {
        id: 'p5',
        name: 'Berry Acai Bowl',
        description: 'Thick açaí blend topped with granola, fresh berries, coconut flakes, and a drizzle of honey.',
        price: 22.00,
        sku: 'AB-001',
        stock: 15,
        category: 'Bowls',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop'],
        created_at: '2026-01-20T08:30:00Z',
    },
    {
        id: 'p6',
        name: 'Craft Kombucha — Ginger',
        description: 'Small-batch fermented kombucha with organic ginger. Probiotic-rich and naturally effervescent.',
        price: 15.50,
        sku: 'KB-001',
        stock: 0,
        category: 'Kombucha',
        status: 'draft',
        images: ['https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=400&fit=crop'],
        created_at: '2026-01-22T14:00:00Z',
    },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: 'ord-001',
        customer_name: 'Ahmad Razak',
        customer_phone: '60123456789',
        items: [
            { product: { id: 'p1', name: 'Signature Cold Brew', price: 18.90, images: MOCK_PRODUCTS[0].images }, qty: 2 },
            { product: { id: 'p4', name: 'Espresso Double Shot', price: 12.00, images: MOCK_PRODUCTS[3].images }, qty: 1 },
        ],
        total: 49.80,
        status: 'delivered',
        created_at: '2026-02-10T14:30:00Z',
    },
    {
        id: 'ord-002',
        customer_name: 'Siti Aminah',
        customer_phone: '60198765432',
        items: [
            { product: { id: 'p2', name: 'Matcha Ceremonial Latte', price: 16.50, images: MOCK_PRODUCTS[1].images }, qty: 3 },
        ],
        total: 49.50,
        status: 'processing',
        created_at: '2026-02-12T09:15:00Z',
    },
    {
        id: 'ord-003',
        customer_name: 'Lee Wei Ming',
        customer_phone: '60171112233',
        items: [
            { product: { id: 'p3', name: 'Tropical Mango Smoothie', price: 14.90, images: MOCK_PRODUCTS[2].images }, qty: 1 },
            { product: { id: 'p5', name: 'Berry Acai Bowl', price: 22.00, images: MOCK_PRODUCTS[4].images }, qty: 2 },
        ],
        total: 58.90,
        status: 'pending',
        created_at: '2026-02-14T16:45:00Z',
    },
    {
        id: 'ord-004',
        customer_name: 'Nurul Izzah',
        customer_phone: '60144455566',
        items: [
            { product: { id: 'p1', name: 'Signature Cold Brew', price: 18.90, images: MOCK_PRODUCTS[0].images }, qty: 1 },
        ],
        total: 18.90,
        status: 'shipped',
        created_at: '2026-02-15T10:00:00Z',
    },
];
