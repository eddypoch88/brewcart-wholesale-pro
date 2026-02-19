/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// Kita guna import.meta.env sebab ini VITE (Bukan Next.js)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- SAFETY CHECK (PENTING!) ---
// Kalau kunci tiada, kita matikan app terus & bagi error jelas.
// Tak payah pening cari punca skrin putih.
// ⚠️ TEMPORARILY DISABLED - Allow app to run without Supabase for testing PaymentModal
if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ WARNING: Supabase Keys Missing! App running in limited mode.");
    console.warn("Database features akan fail. Set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY untuk enable.");
    // throw new Error("Sila check fail .env anda. Pastikan guna VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY.");
}

// --- INITIALIZE CLIENT ---
// Create dummy client kalau keys takde (prevent crash)
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : createClient('https://dummy.supabase.co', 'dummy-key-placeholder');

// --- CONSTANTS ---
// Simpan nama bucket di sini. Kalau nak tukar nama bucket nanti, tukar sini saja.
export const STORAGE_BUCKET = 'products';