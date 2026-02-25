import { useState, useEffect } from 'react';
import { getPublicStoreId, getSettings } from '../lib/storage';
import { StoreSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface PublicStoreState {
    storeId: string | null;
    settings: StoreSettings;
    loading: boolean;
}

/**
 * usePublicStore — resolves the store ID and settings for the PUBLIC storefront.
 *
 * Uses stores.name as the CANONICAL source of truth for the store name.
 * This ensures the storefront always reflects what the admin saved in Settings,
 * even if store_settings.store_name is stale from an old migration.
 */
export function usePublicStore(slug?: string): PublicStoreState {
    const [storeId, setStoreId] = useState<string | null>(null);
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function resolve() {
            try {
                const id = await getPublicStoreId(slug);
                if (cancelled) return;

                setStoreId(id);

                if (id) {
                    // Fetch settings AND canonical store name in parallel
                    const [fetchedSettings, storeRow] = await Promise.all([
                        getSettings(id),
                        supabase.from('stores').select('name').eq('id', id).maybeSingle(),
                    ]);

                    if (!cancelled) {
                        // stores.name is the single source of truth — overrides store_settings.store_name
                        const canonicalName = storeRow.data?.name;
                        setSettings({
                            ...DEFAULT_SETTINGS,
                            ...fetchedSettings,
                            ...(canonicalName ? { store_name: canonicalName } : {}),
                        });
                    }
                }
            } catch (e) {
                console.error('[usePublicStore] Failed:', e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        resolve();
        return () => { cancelled = true; };
    }, [slug]);

    return { storeId, settings, loading };
}
