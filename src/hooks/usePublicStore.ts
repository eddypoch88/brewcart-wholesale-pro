import { useState, useEffect } from 'react';
import { getSettings } from '../lib/storage';
import { StoreSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface PublicStoreState {
    storeId: string | null;
    settings: StoreSettings;
    loading: boolean;
}

/**
 * usePublicStore — resolves store ID + settings for the PUBLIC storefront.
 *
 * Bypasses the sessionStorage-cached getPublicStoreId() to avoid stale data.
 * - With slug: looks up store by slug (multi-tenant URL)
 * - Without slug: picks the most recently updated store (single-tenant default)
 *
 * Always uses stores.name as the canonical store name (single source of truth).
 */
export function usePublicStore(slug?: string): PublicStoreState {
    const [storeId, setStoreId] = useState<string | null>(null);
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function resolve() {
            try {
                // Direct Supabase query — no sessionStorage cache interference
                let storeQuery = supabase
                    .from('stores')
                    .select('id, name');

                if (slug) {
                    storeQuery = storeQuery.eq('slug', slug);
                } else {
                    // Pick most recently updated store (avoids old/stale test stores)
                    storeQuery = storeQuery.order('updated_at', { ascending: false });
                }

                const { data: storeData } = await storeQuery.limit(1).maybeSingle();

                if (cancelled) return;

                const id = storeData?.id ?? null;
                const canonicalName = storeData?.name;

                setStoreId(id);

                if (id) {
                    const fetchedSettings = await getSettings(id);
                    if (!cancelled) {
                        setSettings({
                            ...DEFAULT_SETTINGS,
                            ...fetchedSettings,
                            // stores.name is ALWAYS the canonical name — overrides stale store_settings.store_name
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

