"use client";

import React, { useState } from 'react';
import { Save, Store, CreditCard } from 'lucide-react';

export default function StoreSettingsPage() {
    // State untuk semua input (Disatukan supaya senang urus)
    const [formData, setFormData] = useState({
        storeName: 'Orb Empire Store',
        storeDescription: 'Kedai Serbaneka Paling Mantap di Sabah',
        whatsappNumber: '60123456789',
        currency: 'MYR',
        address: 'Kota Kinabalu, Sabah',
        email: 'admin@orb-empire.com'
    });

    const [isSaving, setIsSaving] = useState(false);

    // Function Generic untuk Handle Perubahan Input (Tanpa Re-render melampau)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulasi Save ke Database
        setTimeout(() => {
            setIsSaving(false);
            alert('Setting Berjaya Disimpan! ✅');
        }, 1000);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 pb-20">

            {/* Header Page */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Store Configuration</h1>
                    <p className="text-slate-500 text-sm">Urus maklumat kedai dan cara pembayaran</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Grid Setting */}
            <div className="grid grid-cols-1 gap-6">

                {/* SECTION 1: GENERAL INFO */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Store className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-slate-800">General Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Store Name</label>
                            <input
                                type="text"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Nama Kedai"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">WhatsApp Number (For Orders)</label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                value={formData.whatsappNumber}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                placeholder="e.g. 60123456789"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                            <textarea
                                name="storeDescription"
                                value={formData.storeDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                placeholder="Cerita sikit pasal kedai ko..."
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 2: PAYMENT & CURRENCY */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-slate-800">Payment & Currency</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Currency</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                            >
                                <option value="MYR">MYR (Ringgit Malaysia)</option>
                                <option value="USD">USD (US Dollar)</option>
                                <option value="SGD">SGD (Singapore Dollar)</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
