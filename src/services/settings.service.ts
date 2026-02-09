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
    // Hardcoded ID = 1 sebab single store mode. 
    // Nanti senang tukar jadi user_id bila perlu.
    private static readonly STORE_ID = 1;

    static async get(): Promise<StoreSettings | null> {
        const { data, error } = await supabase
            .from('store_config') // CORRECTED: Table is 'store_config'
            .select('*')
            .eq('id', this.STORE_ID)
            .single();

        if (error) {
            // Code PGRST116 maksudnya row tak jumpa, return null is okay
            if (error.code === 'PGRST116') return null;
            throw new SettingsError('Gagal tarik data settings.', error);
        }
        return data;
    }

    static async update(storeName: string, whatsapp: string) {
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

        // 2. DATABASE UPDATE
        const { error } = await supabase
            .from('store_config') // CORRECTED: Table is 'store_config'
            .update({
                store_name: storeName.trim(),
                whatsapp_number: whatsapp.trim()
            })
            .eq('id', this.STORE_ID);

        if (error) {
            throw new SettingsError('Database error masa simpan.', error);
        }
    }
}
