import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Store } from '../types';

interface StoreContextType {
    store: Store | null;
    loading: boolean;
    error: string | null;
}

const StoreContext = createContext<StoreContextType>({ store: null, loading: true, error: null });

export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                // 1. Detect Domain
                const hostname = window.location.hostname;
                let domainToCheck = hostname;

                // Localhost Check (For Development)
                if (hostname === 'localhost' || hostname === '127.0.0.1') {
                    // Default to the first store found or a specific dev store
                    // For now, let's try to find a store with domain 'localhost' or just pick the first one
                    domainToCheck = 'localhost';
                }

                console.log('Detecting store for domain:', domainToCheck);

                // 2. Fetch Store from Supabase
                // Try exact match first
                let { data, error } = await supabase
                    .from('stores')
                    .select('*')
                    .eq('domain', domainToCheck)
                    .single();

                if (error && error.code === 'PGRST116') {
                    // If no match found for localhost, maybe fallback to ANY store (Dev mode only)
                    if (domainToCheck === 'localhost') {
                        const { data: anyStore, error: anyError } = await supabase
                            .from('stores')
                            .select('*')
                            .limit(1)
                            .single();

                        if (anyStore) {
                            data = anyStore;
                            console.log('Dev mode: Fallback to first available store:', anyStore.store_name);
                        } else {
                            throw new Error('No stores found. Please create a store in the database.');
                        }
                    } else {
                        throw new Error(`Store not found for domain: ${domainToCheck}`);
                    }
                } else if (error) {
                    throw error;
                }

                if (data) {
                    setStore(data);
                }

            } catch (err: any) {
                console.error('Store Resolution Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStore();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading Store...</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Store Not Found</h1>
                <p className="text-slate-500">{error}</p>
            </div>
        );
    }

    return (
        <StoreContext.Provider value={{ store, loading, error }}>
            {children}
        </StoreContext.Provider>
    );
}
