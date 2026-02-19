/**
 * Script to verify and create store in Supabase
 * Run this to ensure heaven-brew-store.vercel.app store exists
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zmroftvziytyzjmnpuqd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcm9mdHZ6aXl0eXpqbW5wdXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzQ5NDQsImV4cCI6MjA4NjE1MDk0NH0.urNz48CFyU-KV7UEmqGEVxWeWzn1oS4_tBDkLXGPVcg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupStore() {
    const STORE_DOMAIN = 'heaven-brew-store.vercel.app';
    const STORE_NAME = 'Heaven Brew Store';

    console.log('🔍 Checking if store exists for domain:', STORE_DOMAIN);

    try {
        // Check if store exists
        const { data: existingStore, error: fetchError } = await supabase
            .from('stores')
            .select('*')
            .eq('domain', STORE_DOMAIN)
            .single();

        if (existingStore) {
            console.log('✅ Store already exists!');
            console.log('Store ID:', existingStore.id);
            console.log('Store Name:', existingStore.store_name);
            console.log('Domain:', existingStore.domain);
            return existingStore;
        }

        if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 = no rows returned (expected when store doesn't exist)
            throw fetchError;
        }

        // Store doesn't exist, create it
        console.log('⚠️  Store not found. Creating new store...');

        const { data: newStore, error: insertError } = await supabase
            .from('stores')
            .insert([
                {
                    store_name: STORE_NAME,
                    domain: STORE_DOMAIN,
                    whatsapp_number: '+60123456789' // Update this if needed
                }
            ])
            .select()
            .single();

        if (insertError) {
            throw insertError;
        }

        console.log('✅ Store created successfully!');
        console.log('Store ID:', newStore.id);
        console.log('Store Name:', newStore.store_name);
        console.log('Domain:', newStore.domain);

        // Now update any products without store_id to link to this store
        console.log('\n🔄 Migrating existing products to this store...');
        const { data: updatedProducts, error: updateError } = await supabase
            .from('products')
            .update({ store_id: newStore.id })
            .is('store_id', null)
            .select();

        if (updateError) {
            console.warn('⚠️  Warning: Could not update existing products:', updateError.message);
        } else {
            console.log(`✅ Updated ${updatedProducts?.length || 0} products with store_id`);
        }

        return newStore;

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

// Run the setup
setupStore()
    .then(() => {
        console.log('\n🎉 Setup completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Setup failed:', error);
        process.exit(1);
    });
