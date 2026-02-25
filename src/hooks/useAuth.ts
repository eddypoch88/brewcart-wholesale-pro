import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

// Global cache to prevent multiple instances from spamming the network
let superAdminCache: Record<string, boolean> = {};
let superAdminPending: Record<string, Promise<boolean>> = {};

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const checkSuperAdmin = async (userId: string | undefined) => {
            if (!userId) {
                if (mounted) setIsSuperAdmin(false);
                return;
            }

            // Return cached result immediately if available
            if (userId in superAdminCache) {
                if (mounted) setIsSuperAdmin(superAdminCache[userId]);
                return;
            }

            // If a fetch is already running for this user, wait for it
            if (superAdminPending[userId]) {
                const result = await superAdminPending[userId];
                if (mounted) setIsSuperAdmin(result);
                return;
            }

            // Otherwise, start a new fetch and coalesce
            superAdminPending[userId] = (async () => {
                try {
                    const { data, error } = await supabase
                        .from('super_admins')
                        .select('id')
                        .eq('id', userId)
                        .maybeSingle();

                    const isSuper = !!data && !error;
                    superAdminCache[userId] = isSuper;
                    return isSuper;
                } catch (err) {
                    console.error('Super admin check failed:', err);
                    return false;
                }
            })();

            const result = await superAdminPending[userId];
            if (mounted) setIsSuperAdmin(result);
        };

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!mounted) return;
            setSession(session);
            setUser(session?.user ?? null);
            checkSuperAdmin(session?.user?.id).then(() => {
                if (mounted) setLoading(false);
            });
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            setSession(session);
            setUser(session?.user ?? null);
            checkSuperAdmin(session?.user?.id).then(() => {
                if (mounted) setLoading(false);
            });
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        setLoading(true);
        setIsSuperAdmin(false);
        await supabase.auth.signOut();
        setLoading(false);
    };

    return { user, session, isSuperAdmin, loading, signOut };
}
