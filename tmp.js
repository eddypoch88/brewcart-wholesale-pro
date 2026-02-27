import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://zmroftvziytyzjmnpuqd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcm9mdHZ6aXl0eXpqbW5wdXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzQ5NDQsImV4cCI6MjA4NjE1MDk0NH0.urNz48CFyU-KV7UEmqGEVxWeWzn1oS4_tBDkLXGPVcg'
);

async function runDiagnostics() {
    const { data: stores } = await supabase.from('stores').select('*');
    const { data: products } = await supabase.from('products').select('*');

    const orphaned = (products || []).filter(p => !p.store_id);
    const owners = new Set((products || []).map(p => p.store_id));

    console.log(JSON.stringify({
        total_stores: stores?.length,
        total_products: products?.length,
        orphaned_products: orphaned.length,
        distinct_store_ids: owners.size
    }));
}

runDiagnostics();
