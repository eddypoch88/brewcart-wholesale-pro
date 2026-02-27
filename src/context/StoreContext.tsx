import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { StoreSettings } from '../types';
import { getSettings } from '../lib/storage';
import { DEFAULT_SETTINGS } from '../data/mockData';
import { useStore as useStoreHook, generateSlug } from '../hooks/useStore';
import { useAuth } from '../hooks/useAuth';

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-TENANT: StoreContext fetches settings scoped to the current user's
// store.id. Auto-creates a store for existing users who don't have one yet.
// ─────────────────────────────────────────────────────────────────────────────

interface StoreContextType {
    settings: StoreSettings;
    storeId: string | null;
    settingsLoading: boolean;
    reload: () => void;
}

const StoreContext = createContext<StoreContextType>({
    settings: DEFAULT_SETTINGS,
    storeId: null,
    settingsLoading: true,
    reload: () => { },
});

export const useStoreContext = () => useContext(StoreContext);

// Backward-compatible aliases
export const useStore = () => useContext(StoreContext);
export const useStore_Settings = () => useContext(StoreContext);

/**
 * StoreProvider — wraps the entire app.
 *
 * Flow:
 *  1. Wait for auth to resolve
 *  2. Fetch the user's store from `stores` table
 *  3. If no store exists → auto-create one (for existing users migrating to multi-tenant)
 *  4. If auto-create fails (table missing) → fall back to defaults so app doesn't hang
 *  5. Fetch store_settings for that store
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const { store, loading: storeLoading, createStore } = useStoreHook();
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
    const [settingsLoading, setSettingsLoading] = useState(true);
    // useRef instead of useState so it persists across re-renders without triggering extra effects
    const autoCreatingRef = useRef(false);

    const loadSettings = useCallback(async (storeId: string, canonicalName?: string) => {
        try {
            setSettingsLoading(true);
            const fetchedSettings = await getSettings(storeId);
            setSettings({
                ...DEFAULT_SETTINGS,
                ...fetchedSettings,
                // stores.name is the SINGLE SOURCE OF TRUTH for store name.
                // Override whatever store_settings.store_name says.
                store_name: canonicalName || fetchedSettings.store_name || DEFAULT_SETTINGS.store_name,
                operating_hours: {
                    ...DEFAULT_SETTINGS.operating_hours,
                    ...(fetchedSettings.operating_hours || {}),
                },
            });
        } catch (error) {
            console.error('[StoreContext] Failed to load settings:', error);
            setSettings(DEFAULT_SETTINGS);
        } finally {
            setSettingsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Still loading auth or store — wait
        if (authLoading || storeLoading) return;

        // Not logged in (storefront / public pages) → use defaults immediately
        if (!user) {
            setSettings(DEFAULT_SETTINGS);
            setSettingsLoading(false);
            return;
        }

        // User logged in and has a store → load settings, using stores.name as canonical
        if (store?.id) {
            loadSettings(store.id, store.name);  // ← store.name is single source of truth
            return;
        }

        // User logged in but NO store → auto-create (for users pre-dating multi-tenant)
        // Guard with a ref so this only fires ONCE per session, not on every re-render.
        if (!store && !autoCreatingRef.current) {
            // Prevent auto-creation during the onboarding flow
            if (window.location.pathname.includes('/onboarding')) {
                setSettingsLoading(false);
                return;
            }

            autoCreatingRef.current = true;
            const storeName = (user.email || '').split('@')[0] || 'My Store';
            console.log('[StoreContext] No store found — auto-creating for user:', user.id);

            createStore({
                name: storeName,
                slug: generateSlug(storeName) + '-' + user.id.slice(0, 6),
            }).then(newStore => {
                if (newStore?.id) {
                    loadSettings(newStore.id, newStore.name);
                } else {
                    // stores table likely doesn't exist yet — show warning and use defaults
                    console.warn('[StoreContext] Auto-create failed. Please run DB migration in Supabase!');
                    setSettings(DEFAULT_SETTINGS);
                    setSettingsLoading(false);
                }
            });
        }
    }, [authLoading, storeLoading, user, store, createStore, loadSettings]);

    const reload = useCallback(() => {
        if (store?.id) loadSettings(store.id);
    }, [store?.id, loadSettings]);

    return (
        <StoreContext.Provider value={{
            settings,
            storeId: store?.id ?? null,
            settingsLoading: settingsLoading || storeLoading || authLoading,
            reload,
        }}>
            {children}
        </StoreContext.Provider>
    );
}
