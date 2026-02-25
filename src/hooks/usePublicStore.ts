import { useState, useEffect } from 'react';
import { getPublicStoreId, getSettings } from '../lib/storage';
import { StoreSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data/mockData';

interface PublicStoreState {
    storeId: string | null;
    settings: StoreSettings;
    loading: boolean;
}

/**
 * usePublicStore — resolves the store ID and settings for the PUBLIC storefront.
 *
 * Pass a `slug` (from the URL) so the correct store is always loaded.
 * Without a slug, it falls back to the first store in the DB which may be wrong in multi-tenant apps.
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
                    const fetchedSettings = await getSettings(id);
                    if (!cancelled) {
                        setSettings({ ...DEFAULT_SETTINGS, ...fetchedSettings });
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
