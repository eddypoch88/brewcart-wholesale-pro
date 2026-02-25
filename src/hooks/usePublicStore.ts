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
 * Key difference from useStore() / StoreContext:
 *   - Does NOT require the user to be authenticated.
 *   - Uses getPublicStoreId() which simply picks the first store in the DB.
 *   - This is correct for single-tenant deployments (one store per app instance).
 *   - For multi-tenant with URL slugs, getProductsBySlug() / getSettingsBySlug() should be used instead.
 *
 * Usage:
 *   const { storeId, settings, loading } = usePublicStore();
 */
export function usePublicStore(): PublicStoreState {
    const [storeId, setStoreId] = useState<string | null>(null);
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function resolve() {
            try {
                const id = await getPublicStoreId();
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
    }, []);

    return { storeId, settings, loading };
}
