import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // <-- INI RACUN UTK VITE
// Ganti dgn window.location (paling selamat) atau react-router kalau ada
import { UploadCloud, Globe, X } from 'lucide-react';

export default function AddProductPage() {
    // const router = useRouter(); // <-- TAK BOLEH GUNA
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    // Fungsi simple utk navigate
    const handleCancel = () => {
        window.history.back(); // Balik page belakang
    };

    const handleSave = () => {
        alert("Product Saved! (Simulasi)");
        // window.location.href = '/admin/products'; // Contoh redirect manual
    };

    const handleImageUpload = (e: any) => {
        alert("Nanti sambung logic upload sebenar!");
    };

    return (
        <div className="max-w-5xl mx-auto p-6">

            {/* Header */}
            {/* Header: Responsive (Mobile Stack / Desktop Row) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

                {/* Bahagian Tajuk */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-sm text-gray-500 mt-1">Create a new listing for your store.</p>
                </div>

                {/* Bahagian Butang (Mobile: Full Width / Desktop: Auto) */}
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleCancel}
                        className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center justify-center"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <Globe size={16} />
                        <span>Publish</span> {/* Pendekkan sikit text utk mobile */}
                    </button>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* KOLUM KIRI: MEDIA */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Images</h3>

                        {/* Upload Zone */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                            <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                                <UploadCloud className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Click to upload</p>
                            <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF</p>
                            <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                        </div>

                        {/* Preview Area */}
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            <div className="aspect-square bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                Preview
                            </div>
                        </div>
                    </div>
                </div>

                {/* KOLUM KANAN: DETAILS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">

                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Premium Wireless Earbuds"
                            />
                            <p className="text-xs text-gray-400 mt-1 font-mono">
                                URL: /product/{name.toLowerCase().replace(/\s+/g, '-') || '...'}
                            </p>
                        </div>

                        {/* Highlights */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Highlights</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Lightweight, Waterproof, 1 Year Warranty"
                            />
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">RM</span>
                                    <input
                                        type="number"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">RM</span>
                                    <input
                                        type="number"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-gray-500 focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stock & Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                placeholder="Write something awesome..."
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
