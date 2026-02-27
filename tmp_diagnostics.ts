import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''; // Usually anon key is fine for reads if RLS allows, but service_role is better.
// Actually, it's a diagnostic script, I'll bypass RLS if I can use service role. We'll see if anon key works.

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDiagnostics() {
    console.log('--- DIAGNOSTICS START ---');
    
    // Check stores table
    const { data: stores, error: storesErr } = await supabase.from('stores').select('*');
    if (storesErr) console.error('Error fetching stores:', storesErr);
    else console.log(`Total stores: ${stores.length}`);

    // Check products table
    const { data: products, error: productsErr } = await supabase.from('products').select('*');
    if (productsErr) console.error('Error fetching products:', productsErr);
    else {
        const orphaned = products.filter(p => !p.store_id);
        console.log(`Total products: ${products.length}`);
        console.log(`Orphaned products (no store_id): ${orphaned.length}`);
    }

    // Since we are using the anon key, RLS might block us unless we provide a valid session or public read is allowed.
    // Let's check if the table allows public reads.
    
    console.log('--- DIAGNOSTICS END ---');
}

runDiagnostics();
