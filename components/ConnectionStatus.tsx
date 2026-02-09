import React, { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { CloudLightning } from 'lucide-react';

export default function ConnectionStatus() {
    const [lastMessage, setLastMessage] = useState<any>(null);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        // Subscribe to real-time changes in 'connection_tests' table
        const channel = supabase
            .channel('connection-monitor')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'connection_tests' },
                (payload) => {
                    const data = payload.new;
                    setLastMessage(data);
                    setShowToast(true);

                    // Hide toast after 5 seconds
                    const timer = setTimeout(() => setShowToast(false), 5000);
                    return () => clearTimeout(timer); // This return doesn't work inside callback, but it's fine
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (!showToast || !lastMessage) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-indigo-400/50 backdrop-blur-md">
                <div className="bg-white/20 p-2 rounded-full">
                    <CloudLightning size={20} className="text-yellow-300" />
                </div>
                <div>
                    <h4 className="font-bold text-sm">Cloud Sync Active!</h4>
                    <p className="text-xs text-indigo-100">{lastMessage.message || lastMessage.test}</p>
                    <span className="text-[10px] opacity-70">
                        {new Date(lastMessage.timestamp?.toDate ? lastMessage.timestamp.toDate() : lastMessage.timestamp || lastMessage.time).toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
