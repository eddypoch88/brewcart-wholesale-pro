/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// Kita guna import.meta.env sebab ini VITE (Bukan Next.js)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- SAFETY CHECK (PENTING!) ---
// Kalau kunci tiada, kita matikan app terus & bagi error jelas.
// Tak payah pening cari punca skrin putih.
if (!supabaseUrl || !supabaseKey) {
    console.error("🚨 CRITICAL ERROR: Supabase Keys Missing!");
    throw new Error("Sila check fail .env anda. Pastikan guna VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY.");
}

// --- INITIALIZE CLIENT ---
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- CONSTANTS ---
// Simpan nama bucket di sini. Kalau nak tukar nama bucket nanti, tukar sini saja.
export const STORAGE_BUCKET = 'products';