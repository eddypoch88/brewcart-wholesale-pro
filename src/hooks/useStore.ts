import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Store {
    id: string;
    owner_id: string;
    name: string;
    slug: string;
    subdomain: string | null;
    custom_domain: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateStorePayload {
    name: string;
    slug: string;
    subdomain?: string;
}

interface UseStoreReturn {
    store: Store | null;
    loading: boolean;
    error: string | null;
    createStore: (payload: CreateStorePayload) => Promise<Store | null>;
    refetch: () => Promise<void>;
}

// ── Slug helper ────────────────────────────────────────────────────────────

/**
 * Converts a store name into a URL-safe slug.
 * e.g. "Kedai Kopi Ali!" → "kedai-kopi-ali"
 */
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')      // remove special chars
        .replace(/[\s_]+/g, '-')        // spaces/underscores → hyphens
        .replace(/^-+|-+$/g, '');       // trim leading/trailing hyphens
}

// ── Hook ───────────────────────────────────────────────────────────────────

/**
 * useStore — fetches the current authenticated user's store from the `stores` table.
 *
 * Multi-tenant key: every admin session is bound to exactly ONE store.
 * The returned `store.id` (store_id) is used to scope ALL subsequent DB queries.
 *
 * Usage:
 *   const { store, loading, error, createStore } = useStore();
 */
export function useStore(): UseStoreReturn {
    const { user, loading: authLoading } = useAuth();
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStore = useCallback(async () => {
        // Wait for auth to resolve
        if (authLoading) return;

        // No user logged in → clear store state
        if (!user) {
            setStore(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('stores')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (fetchError) {
                // PGRST116 = no rows found → user hasn't created a store yet (normal for new signups)
                if (fetchError.code === 'PGRST116') {
                    setStore(null);
                    setError(null); // Not an error — just needs onboarding
                } else {
                    console.error('[useStore] Error fetching store:', fetchError.message);
                    setError(fetchError.message);
                    setStore(null);
                }
            } else {
                setStore(data as Store);
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error fetching store';
            console.error('[useStore] Unexpected error:', msg);
            setError(msg);
            setStore(null);
        } finally {
            setLoading(false);
        }
    }, [user, authLoading]);

    // Fetch on mount and whenever auth state changes
    useEffect(() => {
        fetchStore();
    }, [fetchStore]);

    /**
     * createStore — call this during seller onboarding when they don't have a store yet.
     * Creates a new store record linked to the current user.
     */
    const createStore = useCallback(async (payload: CreateStorePayload): Promise<Store | null> => {
        if (!user) {
            console.error('[useStore] Cannot create store: no authenticated user');
            return null;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: insertError } = await supabase
                .from('stores')
                .insert([{
                    owner_id: user.id,
                    name: payload.name,
                    slug: payload.slug || generateSlug(payload.name),
                    subdomain: payload.subdomain || generateSlug(payload.name),
                }])
                .select()
                .single();

            if (insertError) {
                // Handle unique slug conflict
                if (insertError.code === '23505') {
                    setError('That store name/slug is already taken. Please choose a different name.');
                } else {
                    setError(insertError.message);
                }
                console.error('[useStore] Error creating store:', insertError.message);
                return null;
            }

            const newStore = data as Store;
            setStore(newStore);

            // Auto-create empty store_settings row for the new store
            await supabase.from('store_settings').insert([{
                store_id: newStore.id,
                store_name: newStore.name,
                currency: 'MYR',
                delivery_fee: 0,
                free_delivery_threshold: 0,
            }]);

            return newStore;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error creating store';
            console.error('[useStore] Unexpected create error:', msg);
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    }, [user]);

    /**
     * refetch — manually re-fetch store data (e.g. after updating store info).
     */
    const refetch = useCallback(async () => {
        await fetchStore();
    }, [fetchStore]);

    return { store, loading, error, createStore, refetch };
}
