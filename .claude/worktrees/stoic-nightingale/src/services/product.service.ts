import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const ProductService = {
    // 1. AMBIL SEMUA PRODUK (BY STORE)
    async getAll(storeId: string) {
        return await supabase
            .from('products')
            .select('*')
            .eq('store_id', storeId) // 🔥 Filter by Store
            .order('created_at', { ascending: false });
    },

    // 2. SIMPAN PRODUK BARU / UPDATE
    async save(product: Partial<Product>, storeId: string, imageFile?: File) {
        let imageUrl = product.images?.[0];

        // Kalau ada gambar baru, upload dulu
        if (imageFile) {
            const fileName = `${storeId}/${Date.now()}-${imageFile.name}`; // Organize by store folder
            const { data, error } = await supabase.storage
                .from('products')
                .upload(fileName, imageFile);

            if (error) throw error;

            // Dapat URL gambar
            const { data: publicUrl } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            imageUrl = publicUrl.publicUrl;
        }

        // Prepare data untuk simpan
        const productData = {
            ...product, // Spread existing data
            store_id: storeId, // 🔥 Force Store ID
            name: product.name,
            description: product.description,
            price: parseFloat(product.price?.toString() || '0'),
            compare_at_price: product.compare_at_price ? parseFloat(product.compare_at_price.toString()) : null,
            stock: parseInt(product.stock?.toString() || '0'),
            status: product.status || 'active',
            images: imageUrl ? [imageUrl] : product.images,
            sku: product.sku || '', // Pastikan ada SKU
            category: product.category || 'General'
        };

        if (product.id) {
            // UPDATE (Kalau ada ID)
            // Ensure we only update if it belongs to the store
            return await supabase
                .from('products')
                .update(productData)
                .eq('id', product.id)
                .eq('store_id', storeId);
        } else {
            // CREATE (Kalau tiada ID)
            return await supabase.from('products').insert([productData]);
        }
    },

    // 3. 🔥 DELETE PRODUK (SINGLE)
    async delete(id: string, storeId: string) {
        return await supabase
            .from('products')
            .delete()
            .eq('id', id)
            .eq('store_id', storeId); // Safety check
    }
};
