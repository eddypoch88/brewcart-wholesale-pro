"use client";

import React, { useState } from 'react';
import { Star, ShieldCheck, Truck, RefreshCw, Award, ChevronRight, Check, MapPin, Info } from 'lucide-react';
import ProductBottomBar from '../../../components/ProductBottomBar'; // Adjusted relative path for safety

export default function ProductPage() {
    // --- MOCK DATA (Untuk Demo Client - Zero Bug Guarantee) ---
    const product = {
        id: 1,
        title: "Kasut Sukan Pro - Running Edition 2026 (Limited Stock)",
        price: 89.00,
        originalPrice: 159.00,
        discount: 44,
        rating: 4.9,
        sold: 1240,
        description: "Kasut sukan rekaan terkini yang direka khas untuk keselesaan maksimum. Sesuai untuk jogging, hiking, dan kegunaan harian. Tapak anti-slip dengan teknologi 'Air-Flow' memastikan kaki anda kekal sejuk.",
        specs: [
            { label: "Material", value: "Premium Mesh & Rubber" },
            { label: "Berat", value: "250g (Ultra Ringan)" },
            { label: "Warna", value: "Hitam / Putih / Merah" },
            { label: "Waranti", value: "1 Bulan (Jahit Koyak Ganti Baru)" },
            { label: "Negara Asal", value: "Imported Quality" },
        ],
        reviews: [
            { name: "Ali M.", text: "Barang sampai laju gila! Kualiti padu.", rating: 5, date: "2 Hari lepas" },
            { name: "Sarah J.", text: "Selesa pakai jogging. Recommended!", rating: 5, date: "1 Minggu lepas" },
            { name: "Tan K.L.", text: "Value for money. Will repeat order.", rating: 4, date: "2 Minggu lepas" }
        ]
    };

    const [selectedColor, setSelectedColor] = useState('Hitam');
    const [selectedSize, setSelectedSize] = useState('42');

    return (
        <div className="min-h-screen bg-slate-100 pb-32 font-sans">
            {/* pb-32 PENTING supaya content tak tertutup dek Bottom Bar */}

            {/* --- 1. HERO IMAGE (Carousel Style) --- */}
            <div className="relative bg-white aspect-square w-full border-b border-slate-200">
                <img
                    src="https://placehold.co/600x600/1e293b/FFF?text=Kasut+Pro+2026"
                    alt="Product Image"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold">
                    1/5 Photos
                </div>
            </div>

            {/* --- 2. PRICE & TITLE SECTION --- */}
            <div className="bg-white p-4 mb-3 shadow-sm">
                <div className="flex items-end gap-2 mb-1">
                    <h1 className="text-3xl font-bold text-rose-600">RM{product.price.toFixed(2)}</h1>
                    <span className="text-slate-400 text-sm line-through mb-1.5">RM{product.originalPrice.toFixed(2)}</span>
                    <span className="mb-1.5 bg-rose-100 text-rose-600 text-[10px] font-bold px-1 py-0.5 rounded">-{product.discount}% OFF</span>
                </div>

                <h2 className="text-lg font-medium text-slate-800 leading-snug mb-2">{product.title}</h2>

                <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-slate-700">{product.rating}</span>
                        <span>/ 5.0</span>
                        <span className="mx-1">•</span>
                        <span>{product.sold} Terjual</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3" /> Sabah
                    </div>
                </div>
            </div>

            {/* --- 3. TRUST BADGES (International Standard) --- */}
            <div className="bg-white p-4 mb-3 shadow-sm">
                <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                        { icon: ShieldCheck, text: "100% Original", color: "text-blue-600" },
                        { icon: Truck, text: "Fast Post", color: "text-green-600" },
                        { icon: RefreshCw, text: "7 Hari Return", color: "text-orange-600" },
                        { icon: Award, text: "Top Rated", color: "text-purple-600" },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                            <div className="p-2 bg-slate-50 rounded-full">
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <span className="text-[10px] font-medium text-slate-600 leading-tight">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- 4. VARIATION SELECTOR --- */}
            <div className="bg-white p-4 mb-3 shadow-sm space-y-4">
                {/* Warna */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-2">Pilih Warna</h3>
                    <div className="flex gap-3">
                        {['Hitam', 'Putih', 'Merah'].map(color => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-4 py-2 rounded-lg text-sm border transition-all ${selectedColor === color ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold' : 'border-slate-200 text-slate-600'}`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Saiz */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-2">Pilih Saiz</h3>
                    <div className="flex flex-wrap gap-3">
                        {['40', '41', '42', '43', '44'].map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm border transition-all ${selectedSize === size ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold' : 'border-slate-200 text-slate-600'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- 5. DESCRIPTION & SPECS TABLE --- */}
            <div className="bg-white p-4 mb-3 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Maklumat Produk</h3>

                {/* Text Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {product.description}
                </p>

                {/* Specs Table (Zebra Striped) */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <tbody>
                            {product.specs.map((spec, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                    <td className="px-4 py-3 font-medium text-slate-500 w-1/3">{spec.label}</td>
                                    <td className="px-4 py-3 text-slate-800 font-semibold">{spec.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- 6. ACCORDION (Shipping Info) --- */}
            <div className="bg-white mb-3 shadow-sm divide-y divide-slate-100">
                <button className="w-full flex items-center justify-between p-4 bg-white active:bg-slate-50">
                    <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Maklumat Penghantaran</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-white active:bg-slate-50">
                    <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Polisi Refund & Waranti</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            {/* --- 7. REVIEWS (Social Proof) --- */}
            <div className="bg-white p-4 mb-3 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-800">Review Pembeli ({product.rating})</h3>
                    <span className="text-xs text-rose-600 font-medium">Lihat Semua</span>
                </div>

                <div className="space-y-4">
                    {product.reviews.map((review, idx) => (
                        <div key={idx} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                                ))}
                            </div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-slate-700">{review.name}</span>
                                <span className="text-[10px] text-slate-400">{review.date}</span>
                            </div>
                            <p className="text-xs text-slate-600">{review.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- 8. FOOTER / SAFE AREA --- */}
            <div className="text-center p-6 text-slate-300 text-xs">
                &copy; 2026 Orb Empire Store. All rights reserved.
            </div>

            {/* --- 9. STICKY BOTTOM BAR --- */}
            <ProductBottomBar
                productName={product.title}
                price={product.price}
                phone="60123456789" // Tukar nombor client nanti
            />

        </div>
    );
}
