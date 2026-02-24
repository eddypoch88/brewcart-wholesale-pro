import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface NotificationItem {
    id: string;
    customerName: string;
    total: number;
    createdAt: string;
    read: boolean;
}

const STORAGE_KEY = 'brewcart_notifications';

export function useNotifications() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }, [notifications]);

    // Fallback simple beep using Web Audio API
    const playBeep = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
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
            console.error("Audio playback error:", e);
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
        // Preload audio
        audioRef.current = new Audio('/notification.mp3');
        audioRef.current.load();

        const channel = supabase
            .channel('orders-notifications')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    const order = payload.new as any;

                    // Only notify for pending orders
                    if (order.status !== 'pending') return;

                    const newNotification: NotificationItem = {
                        id: order.id,
                        customerName: order.customer_name,
                        total: order.total_amount || order.total || 0,
                        createdAt: order.created_at,
                        read: false
                    };

                    setNotifications(prev => [newNotification, ...prev]);
                    playSound();
                    toast.success(`🛒 New Order from ${order.customer_name}! RM ${Number(newNotification.total).toFixed(2)}`, {
                        duration: 6000,
                        position: 'top-center'
                    });
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                (payload) => {
                    const order = payload.new as any;
                    // If status changes away from pending, remove notification
                    if (order.status !== 'pending') {
                        setNotifications(prev => prev.filter(n => n.id !== order.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return {
        notifications,
        unreadCount,
        markAllAsRead,
        clearNotification
    };
}
