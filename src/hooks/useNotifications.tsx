import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface NotificationItem {
    id: string;
    customerName: string;
    total: number;
    createdAt: string;
    read: boolean;
}

interface NotificationsContextValue {
    notifications: NotificationItem[];
    unreadCount: number;
    markAllAsRead: () => void;
    markAsRead: (id: string) => void;
    clearNotification: (id: string) => void;
    addNotification: (n: NotificationItem) => void; // Manual test helper
}

const STORAGE_KEY = 'brewcart_notifications';

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

interface NotificationsProviderProps {
    children: React.ReactNode;
    storeId?: string | null;          // ← multi-tenant: scope realtime to this store
}

export function NotificationsProvider({ children, storeId }: NotificationsProviderProps) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const seenOrderIds = useRef<Set<string>>(new Set());

    // Load initial notifications from database
    useEffect(() => {
        if (!storeId) return;

        const loadNotifications = async () => {
            try {
                // Fetch recent 10 orders
                const { data, error } = await supabase
                    .from('orders')
                    .select('id, customer_name, total_amount, total, created_at, status')
                    .eq('store_id', storeId)
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (error) throw error;

                if (data) {
                    const loaded = data.map(order => ({
                        id: order.id,
                        customerName: order.customer_name || 'Unknown',
                        total: order.total_amount || order.total || 0,
                        createdAt: order.created_at,
                        read: order.status !== 'pending' // Consider it read if not pending
                    }));
                    setNotifications(loaded);
                    loaded.forEach(n => seenOrderIds.current.add(n.id));
                }
            } catch (error) {
                console.error('[Notifications] Error loading initial DB notifications:', error);
            }
        };

        loadNotifications();
    }, [storeId]);

    const playBeep = () => {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.warn('[NotificationBell] Audio fallback error:', e);
        }
    };

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => playBeep());
        } else {
            playBeep();
        }
    };

    useEffect(() => {
        audioRef.current = new Audio('/notification.mp3');
        audioRef.current.load();

        if (!storeId) return;

        console.log('[Notifications] Subscribing to Supabase realtime orders for store:', storeId);

        let channel: ReturnType<typeof supabase.channel>;

        const setupChannel = () => {
            channel = supabase
                .channel(`orders-${storeId}-${Date.now()}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'orders',
                        filter: `store_id=eq.${storeId}`,
                    },
                    (payload) => {
                        console.log('[Notification] Real-time new order received:', payload.new);
                        const order = payload.new as any;

                        if (seenOrderIds.current.has(order.id)) {
                            return;
                        }
                        seenOrderIds.current.add(order.id);

                        const newNotification: NotificationItem = {
                            id: order.id,
                            customerName: order.customer_name || 'Unknown',
                            total: order.total_amount || order.total || 0,
                            createdAt: order.created_at || new Date().toISOString(),
                            read: false
                        };

                        setNotifications(prev => [newNotification, ...prev]);
                        playSound();
                        toast.success(
                            `🛒 New Order from ${newNotification.customerName}! RM ${Number(newNotification.total).toFixed(2)}`,
                            { duration: 6000, position: 'top-center' }
                        );
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'orders',
                        filter: `store_id=eq.${storeId}`,
                    },
                    (payload) => {
                        const order = payload.new as any;
                        if (order.status !== 'pending') {
                            setNotifications(prev => prev.map(n => n.id === order.id ? { ...n, read: true } : n));
                        }
                    }
                )
                .subscribe((status) => {
                    console.log('[Notifications] Channel status:', status);
                    if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                        setTimeout(setupChannel, 3000);
                    }
                });
        };

        setupChannel();

        return () => {
            console.log('[Notifications] Unsubscribing from realtime channel.');
            if (channel) supabase.removeChannel(channel);
        };
    }, [storeId]);

    const unreadCount = notifications.filter(n => !n.read).length;
    const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const clearNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
    const addNotification = (n: NotificationItem) => setNotifications(prev => [n, ...prev]);

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAllAsRead, markAsRead, clearNotification, addNotification }
        }>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationsContext);
    if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>');
    return ctx;
}
