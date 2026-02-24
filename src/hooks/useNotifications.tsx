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

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Persist to localStorage whenever notifications change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }, [notifications]);

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

        console.log('[Notifications] Subscribing to Supabase realtime orders...');

        // Request Web Notification permission
        if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        let channel: ReturnType<typeof supabase.channel>;

        const setupChannel = () => {
            channel = supabase
                .channel(`orders-notifications-global-${Date.now()}`)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'orders' },
                    (payload) => {
                        console.log('[Notification] New order received:', payload.new);
                        const order = payload.new as any;

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

                        // Web Notifications API (System Push Notification)
                        if ('Notification' in window && Notification.permission === 'granted') {
                            new Notification('🛒 New Order!', {
                                body: `${newNotification.customerName} - RM ${Number(newNotification.total).toFixed(2)}`,
                                icon: '/pwa-192x192.png',
                            });
                        }
                    }
                )
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'orders' },
                    (payload) => {
                        const order = payload.new as any;
                        if (order.status !== 'pending') {
                            setNotifications(prev => prev.filter(n => n.id !== order.id));
                        }
                    }
                )
                .subscribe((status) => {
                    console.log('[Notifications] Channel status:', status);
                    if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                        console.warn('[Notifications] Connection lost. Reconnecting in 3 seconds...');
                        setTimeout(setupChannel, 3000);
                    }
                });
        };

        setupChannel();

        return () => {
            console.log('[Notifications] Unsubscribing from realtime channel.');
            if (channel) supabase.removeChannel(channel);
        };
    }, []);

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
