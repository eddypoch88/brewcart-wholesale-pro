import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://zmroftvziytyzjmnpuqd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcm9mdHZ6aXl0eXpqbW5wdXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzQ5NDQsImV4cCI6MjA4NjE1MDk0NH0.urNz48CFyU-KV7UEmqGEVxWeWzn1oS4_tBDkLXGPVcg');

async function run() {
    const { data: stores } = await supabase.from('stores').select('id, name, slug').order('updated_at', { ascending: false });
    console.log('--- ALL STORES ordered by updated_at DESC ---');
    for (const s of stores) {
        const { data: setts } = await supabase.from('store_settings').select('accept_cod, accept_bank_transfer').eq('store_id', s.id).single();
        if (!setts) {
            console.log(s.name, '| NO SETTINGS');
        } else {
            console.log(s.name, '| COD:', setts.accept_cod, '| Bank:', setts.accept_bank_transfer);
        }
    }
}
run();
