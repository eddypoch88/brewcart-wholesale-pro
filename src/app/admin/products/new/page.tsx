import { useState, ChangeEvent } from 'react';
import { UploadCloud, Globe, X, Info, ShieldCheck, ArrowLeft } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/src/shared/firebase-config'; // <--- PASTIKAN PATH NI BETUL
import PrimaryButton from '@/src/components/system/PrimaryButton';

export default function AddProductPage() {
    const [loading, setLoading] = useState(false);

    // State untuk Form Data
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('General'); // Default category
    const [highlights, setHighlights] = useState('');
    const [description, setDescription] = useState('');

    // State untuk Images
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // 1. Handle Image Selection
    const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);

            // Simpan File object untuk upload nanti
            setImageFiles((prev) => [...prev, ...filesArray]);

            // Buat URL preview untuk tunjuk d skrin
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    // Buang image kalau tersalah pilih
    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // 2. Fungsi Upload ke Firebase Storage
    const uploadImagesToStorage = async () => {
        const uploadPromises = imageFiles.map(async (file) => {
            const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        });
        return Promise.all(uploadPromises);
    };

    // 3. Main Function: Save Product
    const handlePublish = async (status: 'active' | 'draft') => {
        // Validasi Asas
        if (!name || !price || !stock) {
            alert("Bosku! Isi dulu Nama, Harga & Stock. Jangan kosong.");
            return;
        }

        setLoading(true);

        try {
            // A. Upload Gambar dulu (kalau ada)
            let imageUrls: string[] = [];
            if (imageFiles.length > 0) {
                imageUrls = await uploadImagesToStorage();
            }

            // B. Generate Slug (URL)
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            // C. Simpan Data ke Firestore
            await addDoc(collection(db, 'products'), {
                name,
                slug,
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                stock: parseInt(stock),
                category,
                highlights,
                description,
                images: imageUrls,
                status, // 'active' atau 'draft'
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            alert(status === 'active' ? "Produk Berjaya Publish! 🚀" : "Disimpan dalam Draft! 📁");

            // Redirect balik ke senarai produk
            window.location.href = '/admin/products';

        } catch (error) {
            console.error("Error saving product:", error);
            alert("Alamak! Ada error masa simpan. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-24">

            {/* HEADER RESPONSIF */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <button onClick={() => window.history.back()} className="text-gray-500 flex items-center gap-1 text-sm mb-2 hover:text-black">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    {/* Button Draft */}
                    <button
                        onClick={() => handlePublish('draft')}
                        disabled={loading}
                        className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Save Draft
                    </button>

                    {/* SYSTEM COMPONENT: PrimaryButton */}
                    <PrimaryButton
                        onClick={() => handlePublish('active')}
                        loading={loading}
                        icon={<Globe size={16} />}
                        className="flex-1 sm:flex-none"
                    >
                        Publish Live
                    </PrimaryButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* KIRI: MEDIA UPLOAD (Real Function) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Images</h3>

                        {/* Upload Zone */}
                        <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                            <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                                <UploadCloud className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Click to upload</p>
                            <p className="text-xs text-gray-500 mt-1">Select multiple files</p>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
                        </label>

                        {/* Preview Grid */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {previews.map((src, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* KANAN: FORM DATA */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">

                        {/* 1. Name & URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Premium Wireless Earbuds"
                            />
                            <p className="text-xs text-gray-400 mt-1 font-mono truncate">
                                URL: /product/{name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '...'}
                            </p>
                        </div>

                        {/* 2. Highlights */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (Short Specs)</label>
                            <input
                                type="text"
                                value={highlights}
                                onChange={(e) => setHighlights(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Waterproof, 2-Year Warranty, Fast Charging"
                            />
                        </div>

                        {/* 3. Pricing */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (RM)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Optional)</label>
                                <input
                                    type="number"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all text-gray-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* 4. Stock & Category */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                                >
                                    <option>General</option>
                                    <option>Electronics</option>
                                    <option>Fashion</option>
                                    <option>Food & Beverage</option>
                                    <option>Beauty</option>
                                </select>
                            </div>
                        </div>

                        {/* 5. Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                placeholder="Describe your product nicely..."
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
