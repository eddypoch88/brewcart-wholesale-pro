import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const ProductService = {
    // 1. AMBIL SEMUA PRODUK
    async getAll() {
        return await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
    },

    // 2. SIMPAN PRODUK BARU / UPDATE
    async save(product: Partial<Product>, imageFile?: File) {
        let imageUrl = product.images?.[0];

        // Kalau ada gambar baru, upload dulu
        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
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
            return await supabase.from('products').update(productData).eq('id', product.id);
        } else {
            // CREATE (Kalau tiada ID)
            return await supabase.from('products').insert([productData]);
        }
    },

    // 3. 🔥 DELETE PRODUK (INI YANG BARU KITA TAMBAH)
    async delete(id: string) {
        return await supabase.from('products').delete().eq('id', id);
    }
};
