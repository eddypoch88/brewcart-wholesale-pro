import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export const useSupabaseCollection = <T = any>(
    tableName: string,
    options?: {
        orderBy?: string,
        ascending?: boolean,
        storeId?: string // 🔥 NEW: Add store filtering
    }
) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<PostgrestError | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let query = supabase.from(tableName).select('*');

            // 🔥 NEW: Filter by store_id if provided
            if (options?.storeId) {
                query = query.eq('store_id', options.storeId);
            }

            if (options?.orderBy) {
                query = query.order(options.orderBy, { ascending: options.ascending ?? false });
            } else {
                // Default ordering: created_at desc
                // Note: Ensure your tables have created_at or pass explicit orderBy
                try {
                    query = query.order('created_at', { ascending: false });
                } catch (e) {
                    // If created_at doesn't exist, this might fail, usually Supabase ignores or returns error
                }
            }

            const { data, error } = await query;

            if (error) {
                console.error(`Error fetching ${tableName}:`, error);
                setError(error);
            } else {
                setData(data as T[]);
            }
            setLoading(false);
        };

        fetchData();

        // Real-time subscription
        const channel = supabase
            .channel(`${tableName}_changes`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: tableName },
                (payload) => {
                    console.log('Real-time change detected:', payload);
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [tableName, options?.orderBy, options?.ascending, options?.storeId]); // 🔥 Added storeId to deps

    return { data, loading, error };
};

export const useSupabaseDocument = <T = any>(tableName: string, id: string | number) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<PostgrestError | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error(`Error fetching ${tableName} ${id}:`, error);
                setError(error);
            } else {
                setData(data as T);
            }
            setLoading(false);
        };

        fetchData();

        // Real-time subscription for specific row
        const channel = supabase
            .channel(`${tableName}_${id}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: tableName, filter: `id=eq.${id}` },
                (payload) => {
                    console.log('Real-time doc change detected:', payload);
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [tableName, id]);

    return { data, loading, error };
};
