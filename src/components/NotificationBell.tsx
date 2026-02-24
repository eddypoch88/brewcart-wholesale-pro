import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellRing, X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, NotificationItem } from '../hooks/useNotifications';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAllAsRead, clearNotification } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = (n: NotificationItem) => {
        setIsOpen(false);
        navigate('/orders'); // Navigate to orders page
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors relative ${isOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                {unreadCount > 0 ? <BellRing size={20} className="animate-bounce text-yellow-500" /> : <Bell size={20} />}

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-slate-900 shadow-lg animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute left-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            New Orders 🔔
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:underline font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <ShoppingBag className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                                <p className="text-sm text-slate-500 font-medium">No new notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer relative group ${!n.read ? 'bg-blue-50/30' : ''}`}
                                        onClick={() => handleItemClick(n)}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm text-slate-900 truncate pr-4">
                                                {n.customerName}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                                {formatTime(n.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-blue-600 font-bold">
                                                RM {Number(n.total).toFixed(2)}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    clearNotification(n.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        {!n.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-2 border-t border-slate-100 bg-slate-50">
                            <button
                                onClick={() => { setIsOpen(false); navigate('/orders'); }}
                                className="w-full py-2 text-xs text-slate-500 font-bold hover:text-slate-800 transition-colors"
                            >
                                View all orders
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
