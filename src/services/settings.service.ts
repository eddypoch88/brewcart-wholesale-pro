import { supabase } from '../lib/supabase';

export interface StoreSettings {
    id: number;
    store_name: string;
    whatsapp_number: string;
}

export class SettingsError extends Error {
    originalError: any;
    constructor(message: string, originalError?: any) {
        super(message);
        this.name = 'SettingsError';
        this.originalError = originalError;
    }
}

export class SettingsService {

    static async get(storeId: string): Promise<StoreSettings | null> {
        const { data, error } = await supabase
            .from('store_config')
            .select('*')
            .eq('store_id', storeId) // 🔥 Filter by store_id
            .single();

        if (error) {
            // Code PGRST116 maksudnya row tak jumpa, return null is okay
            if (error.code === 'PGRST116') return null;
            throw new SettingsError('Gagal tarik data settings.', error);
        }
        return data;
    }

    static async update(storeId: string, storeName: string, whatsapp: string) {
        // 1. VALIDATION
        if (!storeName || !storeName.trim()) {
            throw new SettingsError('Nama kedai wajib diisi bosku!');
        }

        // Regex: Nombor dan simbol + sahaja
        const phoneRegex = /^[0-9+]+$/;
        if (!whatsapp || !whatsapp.trim() || !phoneRegex.test(whatsapp)) {
            throw new SettingsError('Nombor WhatsApp tidak sah (Guna nombor sahaja).');
        }

        if (whatsapp.length < 10) {
            throw new SettingsError('Nombor WhatsApp terlalu pendek.');
        }

        // 2. CHECK IF EXISTS FIRST
        const existing = await this.get(storeId);

        let error;

        if (existing) {
            // UPDATE
            const { error: updateError } = await supabase
                .from('store_config')
                .update({
                    store_name: storeName.trim(),
                    whatsapp_number: whatsapp.trim()
                })
                .eq('store_id', storeId);
            error = updateError;
        } else {
            // INSERT NEW CONFIG
            const { error: insertError } = await supabase
                .from('store_config')
                .insert([{
                    store_id: storeId,
                    store_name: storeName.trim(),
                    whatsapp_number: whatsapp.trim(),
                    currency: 'MYR' // Default
                }]);
            error = insertError;
        }

        if (error) {
            throw new SettingsError('Database error masa simpan.', error);
        }
    }
}
