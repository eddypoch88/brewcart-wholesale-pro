/**
 * Script to check products and their store_id
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zmroftvziytyzjmnpuqd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcm9mdHZ6aXl0eXpqbW5wdXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzQ5NDQsImV4cCI6MjA4NjE1MDk0NH0.urNz48CFyU-KV7UEmqGEVxWeWzn1oS4_tBDkLXGPVcg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkProducts() {
    const STORE_ID = 'd6001c50-ffa5-45f1-b14d-ec7deffc886a';

    console.log('🔍 Checking all products...\n');

    try {
        // Get all products
        const { data: allProducts, error: allError } = await supabase
            .from('products')
            .select('id, name, store_id');

        if (allError) throw allError;

        console.log(`📦 Total products in database: ${allProducts?.length || 0}`);

        // Get products WITH store_id
        const productsWithStore = allProducts?.filter(p => p.store_id) || [];
        console.log(`✅ Products with store_id: ${productsWithStore.length}`);

        // Get products WITHOUT store_id
        const productsWithoutStore = allProducts?.filter(p => !p.store_id) || [];
        console.log(`❌ Products without store_id: ${productsWithoutStore.length}`);

        if (productsWithoutStore.length > 0) {
            console.log('\n⚠️  Products missing store_id:');
            productsWithoutStore.forEach(p => {
                console.log(`  - ${p.name} (${p.id})`);
            });

            console.log('\n🔧 Fixing products without store_id...');
            const { data: updated, error: updateError } = await supabase
                .from('products')
                .update({ store_id: STORE_ID })
                .is('store_id', null)
                .select();

            if (updateError) {
                console.error('❌ Update failed:', updateError.message);
            } else {
                console.log(`✅ Updated ${updated?.length || 0} products with store_id`);
            }
        }

        // Get products for our specific store
        console.log(`\n🏪 Products for Heaven Brew Store (${STORE_ID}):`);
        const { data: storeProducts, error: storeError } = await supabase
            .from('products')
            .select('id, name, price, store_id')
            .eq('store_id', STORE_ID);

        if (storeError) throw storeError;

        console.log(`Found ${storeProducts?.length || 0} products:`);
        storeProducts?.forEach(p => {
            console.log(`  - ${p.name} (RM ${p.price})`);
        });

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

// Run the check
checkProducts()
    .then(() => {
        console.log('\n🎉 Check completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Check failed:', error);
        process.exit(1);
    });
