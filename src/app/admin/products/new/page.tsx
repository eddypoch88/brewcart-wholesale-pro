import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';

export default function ProductUploadForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', description: '' });
    const [imageBase64, setImageBase64] = useState<string | null>(null); // Kita simpan gambar sebagai text

    // 1. FUNGSI TUKAR GAMBAR JADI TEXT (Magic dia sini!)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validasi: Jangan upload gambar besar gila (max 500KB cukup utk test)
            if (file.size > 500000) {
                alert("⚠️ Gambar besar sangat bos! Cari yang bawah 500KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result as string); // Dapat string panjang
            };
            reader.readAsDataURL(file);
        }
    };

    // 2. FUNGSI UPLOAD (Tak payah Storage bucket)
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price) { alert("Isi nama & harga dlu!"); return; }

        setLoading(true);

        try {
            // Terus simpan ke Supabase
            const imageUrl = imageBase64 || "https://via.placeholder.com/150";

            const { error } = await supabase
                .from('products')
                .insert([
                    {
                        name: formData.name,
                        price: Number(formData.price),
                        images: [imageUrl], // Compatible array format
                        description: formData.description,
                        is_active: true
                    }
                ]);

            if (error) throw error;

            alert("✅ SIAP! Upload masuk terus!");
            setFormData({ name: '', price: '', description: '' });
            setImageBase64(null);
            // window.location.reload(); // Kalau mahu refresh page

        } catch (error: any) {
            console.error(error);
            alert("❌ Gagal: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 bg-white border rounded shadow max-w-md mx-auto mt-10">
            <h2 className="text-lg font-bold mb-4 text-center">Upload Produk (Cara Pantas: Base64)</h2>
            <form onSubmit={handleUpload} className="space-y-4">

                {/* Nama */}
                <div>
                    <label className="block text-sm mb-1 font-medium">Nama Produk</label>
                    <input
                        type="text"
                        placeholder="Kopi O Kaw"
                        className="w-full border p-2 rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Harga */}
                <div>
                    <label className="block text-sm mb-1 font-medium">Harga (RM)</label>
                    <input
                        type="number"
                        placeholder="5.00"
                        className="w-full border p-2 rounded"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                </div>

                {/* Description (Extra, if used) */}
                <div>
                    <label className="block text-sm mb-1 font-medium">Description (Optional)</label>
                    <textarea
                        placeholder="Product details..."
                        className="w-full border p-2 rounded"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* Gambar */}
                <div>
                    <label className="block text-sm mb-1 font-medium">Gambar Produk (Max 500KB)</label>
                    <input type="file" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>

                {/* Preview */}
                {imageBase64 && (
                    <div className="mt-2 text-center">
                        <p className="text-xs text-gray-500 mb-1">Preview:</p>
                        <img src={imageBase64} alt="Preview" className="h-32 w-32 object-cover rounded border mx-auto" />
                    </div>
                )}

                <button
                    disabled={loading}
                    className={`w-full text-white p-2 rounded font-bold ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? "Processing..." : "Simpan Produk 🚀"}
                </button>
            </form>
        </div>
    );
}
